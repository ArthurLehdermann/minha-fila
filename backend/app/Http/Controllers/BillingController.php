<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use App\Services\AssinaturaService;
use App\Services\MercadoPago\MercadoPagoClient;
use App\Services\MercadoPago\MercadoPagoException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Assinatura e checkout via Mercado Pago.
 *
 * Cartão e Pix seguem caminhos diferentes:
 *  - cartão → assinatura recorrente (preapproval), renova sozinha;
 *  - Pix    → cobrança avulsa, cada pagamento aprovado compra um ciclo.
 *
 * Em ambos, quem libera o acesso é o webhook — nunca o retorno do front-end.
 */
class BillingController extends Controller
{
    public function __construct(
        private AssinaturaService $assinaturas,
        private MercadoPagoClient $mp,
    ) {
    }

    public function status(): JsonResponse
    {
        $user = auth()->user();

        $assinaturaCartao = $user->assinaturaCartao();

        $pixPendente = Pagamento::where('user_id', $user->id)
            ->where('metodo', Pagamento::METODO_PIX)
            ->where('status', Pagamento::STATUS_PENDENTE)
            ->where('pix_expira_em', '>', now())
            ->latest('id')
            ->first();

        $planStatus = match (true) {
            $user->acessoPago() => 'active',
            $user->emTrial()    => 'trial',
            default             => 'blocked',
        };

        return response()->json([
            'plan_status'          => $planStatus,
            'trial_ends_at'        => $user->trial_ends_at?->toIso8601String(),
            'renews_at'            => $user->acesso_expira_em?->toIso8601String(),
            'assinatura_cartao'    => $assinaturaCartao ? [
                'ciclo'              => $assinaturaCartao->ciclo,
                'status'             => $assinaturaCartao->status,
                'proxima_cobranca'   => $assinaturaCartao->proxima_cobranca_em?->toIso8601String(),
            ] : null,
            'pix_pendente' => $pixPendente ? [
                'id'         => $pixPendente->id,
                'expira_em'  => $pixPendente->pix_expira_em?->toIso8601String(),
            ] : null,
        ]);
    }

    public function checkout(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'ciclo'         => 'required|in:mensal,anual',
            'metodo'        => 'required|in:cartao,pix',
            'card_token_id' => 'nullable|required_if:metodo,cartao|string',
        ]);

        $user = auth()->user();

        if ($dados['metodo'] === 'cartao') {
            return $this->checkoutCartao($user, $dados['ciclo'], $dados['card_token_id']);
        }

        return $this->checkoutPix($user, $dados['ciclo']);
    }

    private function checkoutCartao($user, string $ciclo, string $cardTokenId): JsonResponse
    {
        if ($user->assinaturaCartao()) {
            return response()->json([
                'message' => 'Você já tem uma assinatura no cartão. Cancele a atual antes de trocar de plano.',
            ], 422);
        }

        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');

        try {
            $assinatura = $this->assinaturas->iniciarCartao(
                user: $user,
                ciclo: $ciclo,
                cardTokenId: $cardTokenId,
                backUrl: $frontendUrl . '/filas?checkout=success',
            );
        } catch (\Throwable $e) {
            return $this->erro($e, 'Não foi possível iniciar a assinatura no cartão.');
        }

        return response()->json([
            'ok'     => true,
            'status' => $assinatura->status,
        ]);
    }

    private function checkoutPix($user, string $ciclo): JsonResponse
    {
        try {
            $pagamento = $this->assinaturas->iniciarPix(
                user: $user,
                ciclo: $ciclo,
                notificationUrl: route('mercadopago.webhook'),
            );
        } catch (\Throwable $e) {
            return $this->erro($e, 'Não foi possível gerar a cobrança Pix.');
        }

        return response()->json([
            'id'                 => $pagamento->id,
            'pix_qr_code'        => $pagamento->pix_qr_code,
            'pix_qr_code_base64' => $pagamento->pix_qr_code_base64,
            'expira_em'          => $pagamento->pix_expira_em?->toIso8601String(),
        ]);
    }

    /**
     * Polling da tela do Pix. Consulta o Mercado Pago em vez de só ler o
     * banco: o webhook pode atrasar, e quem está com o QR na tela não deve
     * esperar por ele.
     */
    public function pixStatus(Pagamento $pagamento): JsonResponse
    {
        abort_unless($pagamento->user_id === auth()->id(), 403);

        if (! $pagamento->aprovado() && $pagamento->mp_payment_id) {
            try {
                $dados = $this->mp->buscarPagamento($pagamento->mp_payment_id);
                $pagamento = $this->assinaturas->sincronizarPagamento($dados) ?? $pagamento;
            } catch (MercadoPagoException $e) {
                Log::warning('Falha ao consultar pagamento Pix no Mercado Pago', [
                    'mp_payment_id' => $pagamento->mp_payment_id,
                    'erro'          => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'status'     => $pagamento->status,
            'aprovado'   => $pagamento->aprovado(),
            'expirado'   => $pagamento->pixExpirado(),
            'acesso_ate' => optional($pagamento->acesso_ate)->toIso8601String(),
        ]);
    }

    /**
     * Cancela a recorrência do cartão. O ciclo já pago continua valendo até
     * vencer — cancelar impede a próxima cobrança, não estorna a atual.
     */
    public function cancel(): JsonResponse
    {
        $user = auth()->user();

        try {
            $cancelada = $this->assinaturas->cancelarCartao($user);
        } catch (\Throwable $e) {
            return $this->erro($e, 'Não foi possível cancelar a assinatura.');
        }

        if (! $cancelada) {
            return response()->json(['message' => 'Nenhuma assinatura de cartão ativa para cancelar.'], 422);
        }

        return response()->json([
            'ok'         => true,
            'acesso_ate' => optional($user->fresh()->acessoAte())->toIso8601String(),
        ]);
    }

    private function erro(\Throwable $e, string $mensagem): JsonResponse
    {
        Log::error($mensagem, ['erro' => $e->getMessage()]);

        return response()->json(['message' => $mensagem . ' Tente de novo em alguns minutos.'], 502);
    }
}
