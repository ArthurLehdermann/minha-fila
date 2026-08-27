<?php

namespace App\Http\Controllers;

use App\Services\AssinaturaService;
use App\Services\MercadoPago\MercadoPagoClient;
use App\Services\MercadoPago\WebhookSignature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Recebe as notificações do Mercado Pago.
 *
 * É a única fonte de verdade para liberar acesso: o retorno do navegador é
 * controlado pelo assinante e não prova pagamento nenhum.
 *
 * O corpo da notificação nunca é tratado como verdade — ele diz *qual* recurso
 * mudou, e a gente consulta a API do MP para saber *como* ele está.
 */
class MercadoPagoWebhookController extends Controller
{
    public function __construct(
        private AssinaturaService $assinaturas,
        private MercadoPagoClient $mp,
        private WebhookSignature $assinatura,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        if (! $this->assinatura->configurado()) {
            // Sem segredo não dá para distinguir o MP de qualquer um que
            // descubra a URL. Em produção isso é erro de configuração.
            if (app()->environment('production')) {
                Log::error('Webhook do Mercado Pago recebido sem MP_WEBHOOK_SECRET configurado');

                return response()->json(['erro' => 'webhook não configurado'], 500);
            }

            Log::warning('Assinatura do webhook do Mercado Pago não verificada (sem segredo configurado)');
        } elseif (! $this->assinatura->valida($request)) {
            Log::warning('Webhook do Mercado Pago com assinatura inválida', [
                'ip'    => $request->ip(),
                'topic' => $this->topico($request),
            ]);

            return response()->json(['erro' => 'assinatura inválida'], 401);
        }

        $topico = $this->topico($request);
        $id     = $this->recursoId($request);

        if (! $topico || ! $id) {
            return response()->json(['ignorado' => true]);
        }

        try {
            $tratado = $this->tratar($topico, $id);
        } catch (\Throwable $e) {
            Log::error('Falha ao processar webhook do Mercado Pago', [
                'topic' => $topico,
                'id'    => $id,
                'erro'  => $e->getMessage(),
            ]);

            // 5xx faz o Mercado Pago reenviar. É o que a gente quer quando a
            // falha é nossa (rede, banco fora) — o pagamento não pode ficar
            // sem crédito por causa de um erro transitório.
            return response()->json(['erro' => 'falha ao processar'], 500);
        }

        return response()->json(['ok' => $tratado]);
    }

    private function tratar(string $topico, string $id): bool
    {
        switch ($topico) {
            case 'payment':
                $this->assinaturas->sincronizarPagamento($this->mp->buscarPagamento($id));

                return true;

            case 'preapproval':
            case 'subscription_preapproval':
                $this->assinaturas->sincronizarAssinatura($this->mp->buscarAssinatura($id));

                return true;

            case 'subscription_authorized_payment':
                $this->tratarCobrancaDeAssinatura($id);

                return true;

            default:
                Log::info('Webhook do Mercado Pago com tópico não tratado', ['topic' => $topico]);

                return false;
        }
    }

    /**
     * Cobrança gerada por uma assinatura de cartão. O recurso notificado é o
     * authorized_payment, que aponta para o pagamento de verdade e para o
     * preapproval — é assim que a renovação mensal empurra a vigência.
     */
    private function tratarCobrancaDeAssinatura(string $id): void
    {
        $autorizado = $this->mp->buscarPagamentoAutorizado($id);

        $preapprovalId = $autorizado['preapproval_id'] ?? null;

        $assinatura = $preapprovalId
            ? $this->assinaturas->sincronizarAssinatura($this->mp->buscarAssinatura((string) $preapprovalId))
            : null;

        $pagamentoId = data_get($autorizado, 'payment.id');

        if (! $pagamentoId) {
            // Ainda não houve cobrança (agendada ou recusada sem pagamento).
            Log::info('Cobrança de assinatura sem pagamento associado', ['authorized_payment_id' => $id]);

            return;
        }

        $this->assinaturas->sincronizarPagamento(
            $this->mp->buscarPagamento((string) $pagamentoId),
            $assinatura,
        );
    }

    /**
     * O MP manda o tópico ora em `type` (corpo), ora em `topic` (query), a
     * depender da idade da integração.
     */
    private function topico(Request $request): ?string
    {
        $topico = $request->input('type')
            ?? $request->input('topic')
            ?? $request->query('type')
            ?? $request->query('topic');

        return $topico ? (string) $topico : null;
    }

    private function recursoId(Request $request): ?string
    {
        $id = $request->input('data.id')
            ?? $request->query('data.id')
            ?? $request->query('data_id')
            ?? $request->input('id');

        return ($id === null || $id === '') ? null : (string) $id;
    }
}
