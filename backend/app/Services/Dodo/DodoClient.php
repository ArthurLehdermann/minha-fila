<?php

namespace App\Services\Dodo;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class DodoClient
{
    public function isConfigured(): bool
    {
        return filled(config('dodo.api_key'));
    }

    public function productIdFor(string $ciclo): ?string
    {
        $id = config("dodo.planos.{$ciclo}.product_id");

        return is_string($id) && $id !== '' ? $id : null;
    }

    public function priceUsdFor(string $ciclo): ?float
    {
        $price = config("dodo.planos.{$ciclo}.price_usd");

        return is_numeric($price) ? (float) $price : null;
    }

    public function cicloForProduct(?string $productId): ?string
    {
        if (! $productId) {
            return null;
        }

        foreach ((array) config('dodo.planos', []) as $ciclo => $plano) {
            if (($plano['product_id'] ?? null) === $productId) {
                return (string) $ciclo;
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    public function knownProductIds(): array
    {
        $ids = [];

        foreach ((array) config('dodo.planos', []) as $plano) {
            $id = $plano['product_id'] ?? null;
            if (is_string($id) && $id !== '') {
                $ids[] = $id;
            }
        }

        return $ids;
    }

    public function ownsProduct(?string $productId): bool
    {
        return $productId !== null && in_array($productId, $this->knownProductIds(), true);
    }

    /**
     * Cria uma sessão de checkout hospedada no Dodo para a assinatura do ciclo.
     *
     * @param  array<string, string>  $metadata
     * @return array{checkout_url: string, session_id: string}
     */
    public function createCheckout(string $productId, string $returnUrl, ?string $email, array $metadata): array
    {
        $payload = [
            'product_cart' => [['product_id' => $productId, 'quantity' => 1]],
            'return_url' => $returnUrl,
            'metadata' => $metadata,
            'feature_flags' => ['allow_discount_code' => true],
        ];

        if ($email) {
            $payload['customer'] = ['email' => $email];
        }

        $response = $this->http()->post('/checkouts', $payload);

        if (! $response->successful()) {
            throw DodoException::fromResponse('checkout', $response->status(), $response->body());
        }

        $url = $response->json('checkout_url');
        if (! is_string($url) || $url === '') {
            throw new DodoException('Dodo Payments: resposta de checkout sem checkout_url.');
        }

        return [
            'checkout_url' => $url,
            'session_id' => (string) ($response->json('session_id') ?? ''),
        ];
    }

    public function cancelSubscription(string $subscriptionId): void
    {
        $response = $this->http()->patch('/subscriptions/'.$subscriptionId, ['status' => 'cancelled']);

        if (! $response->successful()) {
            throw DodoException::fromResponse('cancel subscription', $response->status(), $response->body());
        }
    }

    private function http(): PendingRequest
    {
        $apiKey = config('dodo.api_key');

        if (! is_string($apiKey) || $apiKey === '') {
            throw new DodoException('DODO_PAYMENTS_API_KEY não configurada.');
        }

        $mode = (string) config('dodo.mode', 'test');
        $baseUrl = (string) (config("dodo.base_urls.{$mode}") ?? config('dodo.base_urls.test'));

        return Http::baseUrl($baseUrl)
            ->withToken($apiKey)
            ->acceptJson()
            ->asJson()
            ->timeout((int) config('dodo.timeout', 20));
    }
}
