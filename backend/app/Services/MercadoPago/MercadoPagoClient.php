<?php

namespace App\Services\MercadoPago;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Cliente HTTP da API do Mercado Pago.
 *
 * Cobre só o que a assinatura do Minha Fila usa: planos e assinaturas de
 * cartão (preapproval) e pagamento avulso via Pix. Não usamos o SDK oficial
 * porque ele arrasta uma dependência grande para meia dúzia de endpoints.
 */
class MercadoPagoClient
{
    public function __construct(
        private ?string $accessToken = null,
        private ?string $baseUrl = null,
        private ?int $timeout = null,
    ) {
        $this->accessToken ??= (string) config('mercadopago.access_token');
        $this->baseUrl     ??= rtrim((string) config('mercadopago.base_url'), '/');
        $this->timeout     ??= (int) config('mercadopago.timeout');
    }

    public function configurado(): bool
    {
        return $this->accessToken !== '';
    }

    /* ---------------------------------------------------------------- planos */

    /**
     * Cria um plano de assinatura (cobrança recorrente no cartão).
     *
     * O Mercado Pago só aceita `days` ou `months` em frequency_type — não
     * existe `years`. Anual é 12 meses.
     *
     * @param  string  $ciclo  mensal|anual
     */
    public function criarPlano(string $titulo, string $ciclo, float $valor, string $backUrl): array
    {
        return $this->post('/preapproval_plan', [
            'reason' => $titulo,
            'auto_recurring' => [
                'frequency'          => $ciclo === 'anual' ? 12 : 1,
                'frequency_type'     => 'months',
                'transaction_amount' => round($valor, 2),
                'currency_id'        => config('mercadopago.currency'),
            ],
            'back_url' => $backUrl,
            'payment_methods_allowed' => [
                'payment_types' => [['id' => 'credit_card']],
            ],
        ]);
    }

    public function buscarPlano(string $planId): array
    {
        return $this->get("/preapproval_plan/{$planId}");
    }

    /* ----------------------------------------------------------- assinaturas */

    /**
     * Cria a assinatura em si. Uma assinatura com plano associado
     * (`preapproval_plan_id`) SEMPRE exige `card_token_id` já tokenizado no
     * cliente e `status: authorized` — o Mercado Pago não devolve init_point
     * pra hospedar a coleta do cartão nesse fluxo.
     */
    public function criarAssinatura(
        string $planId,
        string $payerEmail,
        string $externalReference,
        string $cardTokenId,
        string $backUrl,
    ): array {
        return $this->post('/preapproval', [
            'preapproval_plan_id' => $planId,
            'card_token_id'       => $cardTokenId,
            'payer_email'         => $payerEmail,
            'external_reference'  => $externalReference,
            'back_url'            => $backUrl,
            'status'              => 'authorized',
        ]);
    }

    public function buscarAssinatura(string $preapprovalId): array
    {
        return $this->get("/preapproval/{$preapprovalId}");
    }

    public function cancelarAssinatura(string $preapprovalId): array
    {
        return $this->put("/preapproval/{$preapprovalId}", ['status' => 'cancelled']);
    }

    /**
     * Cobrança individual gerada por uma assinatura de cartão. É o que o
     * webhook manda no topic subscription_authorized_payment.
     */
    public function buscarPagamentoAutorizado(string $id): array
    {
        return $this->get("/authorized_payments/{$id}");
    }

    /* ------------------------------------------------------------------- pix */

    /**
     * Pagamento avulso via Pix. Devolve QR code e copia-e-cola em
     * point_of_interaction.transaction_data.
     */
    public function criarPagamentoPix(
        float $valor,
        string $descricao,
        string $payerEmail,
        string $externalReference,
        string $notificationUrl,
        ?array $payerIdentificacao = null,
        ?string $payerNome = null,
    ): array {
        $payer = ['email' => $payerEmail];

        if ($payerNome) {
            $payer['first_name'] = $payerNome;
        }

        if ($payerIdentificacao) {
            $payer['identification'] = $payerIdentificacao;
        }

        $expiracao = now()->addMinutes((int) config('mercadopago.pix.expiracao_minutos'));

        return $this->post('/v1/payments', [
            'transaction_amount' => round($valor, 2),
            'description'        => $descricao,
            'payment_method_id'  => 'pix',
            'payer'              => $payer,
            'external_reference' => $externalReference,
            'notification_url'   => $notificationUrl,
            'date_of_expiration' => $expiracao->format('Y-m-d\TH:i:s.vP'),
        ], idempotencyKey: $externalReference);
    }

    public function buscarPagamento(string $paymentId): array
    {
        return $this->get("/v1/payments/{$paymentId}");
    }

    /**
     * Pagamentos com um dado external_reference, do mais novo para o mais
     * antigo. As cobranças que a assinatura de cartão gera herdam a
     * referência do preapproval — é assim que a reconciliação encontra uma
     * renovação cujo webhook se perdeu.
     *
     * @return array<int, array<string, mixed>>
     */
    public function pagamentosPorReferencia(string $externalReference, int $limite = 20): array
    {
        $resposta = $this->get('/v1/payments/search?' . http_build_query([
            'external_reference' => $externalReference,
            'sort'               => 'date_created',
            'criteria'           => 'desc',
            'limit'              => $limite,
        ]));

        return $resposta['results'] ?? [];
    }

    /* --------------------------------------------------------------- interno */

    private function request(?string $idempotencyKey = null): PendingRequest
    {
        $headers = ['Accept' => 'application/json'];

        // O Mercado Pago exige chave de idempotência em POST que cria cobrança;
        // sem ela um retry de rede vira cobrança duplicada.
        if ($idempotencyKey !== null) {
            $headers['X-Idempotency-Key'] = Str::limit($idempotencyKey, 64, '');
        }

        return Http::withToken($this->accessToken)
            ->withHeaders($headers)
            ->timeout($this->timeout)
            ->acceptJson()
            ->asJson();
    }

    private function get(string $path): array
    {
        return $this->handle($this->request()->get($this->baseUrl . $path), 'GET', $path);
    }

    private function post(string $path, array $payload, ?string $idempotencyKey = null): array
    {
        return $this->handle(
            $this->request($idempotencyKey)->post($this->baseUrl . $path, $payload),
            'POST',
            $path,
        );
    }

    private function put(string $path, array $payload): array
    {
        return $this->handle($this->request()->put($this->baseUrl . $path, $payload), 'PUT', $path);
    }

    private function handle($response, string $metodo, string $path): array
    {
        if ($response->failed()) {
            throw MercadoPagoException::daResposta($metodo, $path, $response);
        }

        return (array) $response->json();
    }
}
