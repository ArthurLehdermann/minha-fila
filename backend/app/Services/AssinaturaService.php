<?php

namespace App\Services;

use App\Models\Assinatura;
use App\Models\Pagamento;
use App\Models\User;
use App\Services\MercadoPago\MercadoPagoClient;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Regras de assinatura e vigência de acesso.
 *
 * Dois caminhos de pagamento, uma única noção de acesso:
 *
 *  - Cartão: assinatura recorrente (preapproval). Cada cobrança aprovada
 *    empurra `users.acesso_expira_em` em um ciclo.
 *  - Pix: pagamento avulso. Como não existe débito recorrente em Pix, cada
 *    pagamento aprovado compra exatamente um ciclo.
 *
 * O acesso é cortado quando `acesso_expira_em` vence (e o trial já acabou),
 * independentemente de qual dos dois caminhos pagou.
 */
class AssinaturaService
{
    public const CICLOS = ['mensal', 'anual'];

    public function __construct(private MercadoPagoClient $mp)
    {
    }

    /* --------------------------------------------------------------- cartão */

    /**
     * Cria a assinatura recorrente já autorizada com o cartão tokenizado no
     * cliente (Secure Fields/Bricks). O crédito do acesso continua vindo só
     * do webhook, quando o MP cobrar a primeira parcela.
     */
    public function iniciarCartao(User $user, string $ciclo, string $cardTokenId, string $backUrl): Assinatura
    {
        $this->validarCiclo($ciclo);

        $planId = $this->preapprovalPlanId($ciclo);

        if (empty($planId)) {
            throw new RuntimeException(
                "Ciclo {$ciclo} não está sincronizado no Mercado Pago (falta MP_PLAN_ID_" . strtoupper($ciclo) . ')'
            );
        }

        $assinatura = Assinatura::create([
            'user_id'                => $user->id,
            'ciclo'                  => $ciclo,
            'mp_preapproval_plan_id' => $planId,
            'status'                 => Assinatura::STATUS_PENDENTE,
        ]);

        try {
            $resposta = $this->mp->criarAssinatura(
                planId: $planId,
                payerEmail: $user->email,
                externalReference: $this->referencia($user, $assinatura->id),
                cardTokenId: $cardTokenId,
                backUrl: $backUrl,
            );
        } catch (\Throwable $e) {
            $assinatura->delete();
            throw $e;
        }

        $assinatura->update([
            'mp_preapproval_id' => $resposta['id'] ?? null,
            'status'            => $resposta['status'] ?? Assinatura::STATUS_PENDENTE,
        ]);

        return $assinatura;
    }

    public function cancelarCartao(User $user): bool
    {
        $assinatura = $user->assinaturaCartao();

        if (! $assinatura || ! $assinatura->mp_preapproval_id) {
            return false;
        }

        $this->mp->cancelarAssinatura($assinatura->mp_preapproval_id);

        $assinatura->update([
            'status'       => Assinatura::STATUS_CANCELADA,
            'cancelada_em' => now(),
        ]);

        // O ciclo já pago continua valendo até `acesso_expira_em` — cancelar
        // não estorna, só impede a próxima cobrança.
        return true;
    }

    /* ------------------------------------------------------------------ pix */

    /**
     * Gera a cobrança Pix de um ciclo. O acesso só é liberado quando o
     * webhook (ou a reconciliação) confirmar a aprovação.
     */
    public function iniciarPix(User $user, string $ciclo, string $notificationUrl): Pagamento
    {
        $this->validarCiclo($ciclo);

        $valor = (float) config("mercadopago.planos.{$ciclo}.preco");

        if ($valor <= 0) {
            throw new RuntimeException("Ciclo {$ciclo} está sem preço configurado.");
        }

        $referencia = $this->referencia($user, Str::uuid()->toString());

        $resposta = $this->mp->criarPagamentoPix(
            valor: $valor,
            descricao: "Minha Fila — plano {$ciclo}",
            payerEmail: $user->email,
            externalReference: $referencia,
            notificationUrl: $notificationUrl,
            payerNome: $user->name,
        );

        $dadosPix = data_get($resposta, 'point_of_interaction.transaction_data', []);

        return Pagamento::create([
            'user_id'            => $user->id,
            'metodo'             => Pagamento::METODO_PIX,
            'ciclo'              => $ciclo,
            'mp_payment_id'      => isset($resposta['id']) ? (string) $resposta['id'] : null,
            'status'             => $resposta['status'] ?? Pagamento::STATUS_PENDENTE,
            'valor'              => $valor,
            'pix_qr_code'        => $dadosPix['qr_code'] ?? null,
            'pix_qr_code_base64' => $dadosPix['qr_code_base64'] ?? null,
            'pix_expira_em'      => $this->instante($resposta['date_of_expiration'] ?? null)
                ?? now()->addMinutes((int) config('mercadopago.pix.expiracao_minutos')),
            'payload'            => $resposta,
        ]);
    }

    /* ----------------------------------------------------- sincronização MP */

    /**
     * Reflete no banco o estado de um pagamento do Mercado Pago e, se ele
     * estiver aprovado, credita o ciclo de acesso.
     *
     * Idempotente: o crédito só acontece na transição para aprovado, marcada
     * por `acesso_ate`. O MP reenvia a mesma notificação várias vezes.
     */
    public function sincronizarPagamento(array $dados, ?Assinatura $assinatura = null): ?Pagamento
    {
        $mpId = isset($dados['id']) ? (string) $dados['id'] : null;

        if (! $mpId) {
            return null;
        }

        $pagamento = Pagamento::where('mp_payment_id', $mpId)->first();

        $userId = $pagamento?->user_id
            ?? $assinatura?->user_id
            ?? $this->userIdDaReferencia($dados['external_reference'] ?? null);

        if (! $userId) {
            Log::warning('Pagamento do Mercado Pago sem usuário identificável', ['mp_payment_id' => $mpId]);

            return null;
        }

        $atributos = [
            'user_id' => $userId,
            'status'  => $dados['status'] ?? Pagamento::STATUS_PENDENTE,
            'valor'   => (float) ($dados['transaction_amount'] ?? $pagamento?->valor ?? 0),
            'payload' => $dados,
        ];

        if ($assinatura) {
            $atributos['assinatura_id'] = $assinatura->id;
            $atributos['ciclo']         = $assinatura->ciclo;
            $atributos['metodo']        = Pagamento::METODO_CARTAO;
        }

        if (! $pagamento) {
            $atributos['mp_payment_id'] = $mpId;
            $atributos['metodo'] ??= ($dados['payment_method_id'] ?? null) === 'pix'
                ? Pagamento::METODO_PIX
                : Pagamento::METODO_CARTAO;
            $atributos['ciclo'] ??= 'mensal';

            $pagamento = Pagamento::create($atributos);
        } else {
            $pagamento->fill($atributos)->save();
        }

        if ($pagamento->aprovado()) {
            $this->creditarCiclo($pagamento, $dados);

            // O crédito acontece numa cópia travada dentro da transação; sem
            // isso quem chamou receberia o modelo sem `acesso_ate`.
            $pagamento->refresh();
        }

        return $pagamento;
    }

    /**
     * Reflete o estado de uma assinatura (preapproval) do Mercado Pago.
     */
    public function sincronizarAssinatura(array $dados): ?Assinatura
    {
        $mpId = isset($dados['id']) ? (string) $dados['id'] : null;

        if (! $mpId) {
            return null;
        }

        $assinatura = Assinatura::where('mp_preapproval_id', $mpId)->first();

        if (! $assinatura) {
            $assinaturaId = $this->sufixoDaReferencia($dados['external_reference'] ?? null);
            $assinatura = $assinaturaId ? Assinatura::find($assinaturaId) : null;

            if ($assinatura) {
                $assinatura->mp_preapproval_id = $mpId;
            }
        }

        if (! $assinatura) {
            Log::warning('Assinatura do Mercado Pago sem correspondente local', ['mp_preapproval_id' => $mpId]);

            return null;
        }

        $assinatura->status = $dados['status'] ?? $assinatura->status;

        if (! empty($dados['next_payment_date'])) {
            $assinatura->proxima_cobranca_em = $this->instante($dados['next_payment_date']);
        }

        if ($assinatura->status === Assinatura::STATUS_CANCELADA && ! $assinatura->cancelada_em) {
            $assinatura->cancelada_em = now();
        }

        $assinatura->save();

        // Um preapproval só fica "authorized" depois do primeiro pagamento
        // aprovado, mas a notificação desse pagamento pode chegar antes ou
        // depois. Guardar o payer_id aqui evita depender da ordem.
        if (! empty($dados['payer_id'])) {
            User::whereKey($assinatura->user_id)
                ->whereNull('mp_payer_id')
                ->update(['mp_payer_id' => (string) $dados['payer_id']]);
        }

        return $assinatura;
    }

    /* -------------------------------------------------- reconciliação (cron) */

    /**
     * Relê no Mercado Pago o estado de um pagamento que ficou pendente.
     */
    public function reconciliarPagamento(Pagamento $pagamento): ?Pagamento
    {
        if (! $pagamento->mp_payment_id) {
            return null;
        }

        return $this->sincronizarPagamento($this->mp->buscarPagamento($pagamento->mp_payment_id));
    }

    /**
     * Relê a assinatura e, principalmente, as cobranças que ela gerou.
     *
     * A renovação do cartão chega por webhook; se esse webhook se perder, o
     * assinante em dia seria cortado no vencimento. Aqui a gente procura as
     * cobranças pela referência externa e credita o que faltou.
     *
     * @return int quantidade de cobranças aprovadas que viraram acesso agora
     */
    public function reconciliarAssinatura(Assinatura $assinatura): int
    {
        if ($assinatura->mp_preapproval_id) {
            $this->sincronizarAssinatura($this->mp->buscarAssinatura($assinatura->mp_preapproval_id));
            $assinatura->refresh();
        }

        $referencia = "user:{$assinatura->user_id}:{$assinatura->id}";

        $creditados = 0;

        foreach ($this->mp->pagamentosPorReferencia($referencia) as $dados) {
            $mpId = isset($dados['id']) ? (string) $dados['id'] : null;

            $jaCreditado = $mpId && Pagamento::where('mp_payment_id', $mpId)
                ->whereNotNull('acesso_ate')
                ->exists();

            $pagamento = $this->sincronizarPagamento($dados, $assinatura);

            if (! $jaCreditado && $pagamento?->acesso_ate) {
                $creditados++;
            }
        }

        return $creditados;
    }

    /* -------------------------------------------------------------- interno */

    /**
     * Empurra a vigência do usuário em um ciclo. Roda dentro de transação com
     * lock para não creditar duas vezes quando o MP dispara notificações
     * concorrentes do mesmo pagamento.
     */
    private function creditarCiclo(Pagamento $pagamento, array $dados): void
    {
        DB::transaction(function () use ($pagamento, $dados) {
            $pagamento = Pagamento::whereKey($pagamento->id)->lockForUpdate()->first();

            if (! $pagamento || $pagamento->acesso_ate !== null) {
                return; // já creditado
            }

            $user = User::whereKey($pagamento->user_id)->lockForUpdate()->first();

            if (! $user) {
                return;
            }

            $base = $this->baseDeVigencia($user);
            $ate  = $pagamento->ciclo === 'anual' ? $base->copy()->addYear() : $base->copy()->addMonth();

            $user->acesso_expira_em = $ate;

            if (empty($user->mp_payer_id) && ! empty($dados['payer']['id'])) {
                $user->mp_payer_id = (string) $dados['payer']['id'];
            }

            $user->saveQuietly();

            $pagamento->acesso_ate = $ate;
            $pagamento->pago_em = $this->instante($dados['date_approved'] ?? null) ?? now();
            $pagamento->save();

            Log::info('Ciclo de acesso creditado', [
                'user_id'       => $user->id,
                'mp_payment_id' => $pagamento->mp_payment_id,
                'metodo'        => $pagamento->metodo,
                'ciclo'         => $pagamento->ciclo,
                'acesso_ate'    => $ate->toIso8601String(),
            ]);
        });
    }

    /**
     * Renovar em dia estende a partir do vencimento (não perde os dias que
     * sobraram). Renovar atrasado estende a partir de hoje.
     */
    private function baseDeVigencia(User $user): Carbon
    {
        $atual = $user->acesso_expira_em;

        if ($atual && $atual->isFuture()) {
            return $atual->copy();
        }

        // Quem ainda está no trial só começa a consumir o ciclo pago quando o
        // trial acabar — senão o assinante perde os dias grátis que restavam.
        if ($user->trial_ends_at && $user->trial_ends_at->isFuture()) {
            return $user->trial_ends_at->copy();
        }

        return now();
    }

    /**
     * Converte data do Mercado Pago para o fuso da aplicação.
     *
     * O MP responde no fuso da conta (`...-04:00`) e o cast `datetime` grava
     * o horário **como veio**, sem converter: sem isso o Pix nasce com a
     * expiração horas no passado e a tela dá o QR por vencido antes de o MP
     * parar de aceitá-lo.
     */
    private function instante(?string $valor): ?Carbon
    {
        if (empty($valor)) {
            return null;
        }

        return Carbon::parse($valor)->setTimezone(config('app.timezone'));
    }

    private function validarCiclo(string $ciclo): void
    {
        if (! in_array($ciclo, self::CICLOS, true)) {
            throw new RuntimeException("Ciclo inválido: {$ciclo}");
        }
    }

    private function preapprovalPlanId(string $ciclo): ?string
    {
        return config("mercadopago.planos.{$ciclo}.preapproval_plan_id");
    }

    private function referencia(User $user, string|int $sufixo): string
    {
        return "user:{$user->id}:{$sufixo}";
    }

    private function userIdDaReferencia(?string $referencia): ?string
    {
        if (! $referencia || ! preg_match('/^user:([^:]+):/', $referencia, $m)) {
            return null;
        }

        return $m[1];
    }

    private function sufixoDaReferencia(?string $referencia): ?string
    {
        if (! $referencia || ! preg_match('/^user:[^:]+:(.+)$/', $referencia, $m)) {
            return null;
        }

        return $m[1];
    }
}
