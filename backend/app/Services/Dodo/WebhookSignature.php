<?php

namespace App\Services\Dodo;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Valida a assinatura Standard Webhooks do Dodo:
 * base64(HMAC-SHA256("{webhook-id}.{webhook-timestamp}.{corpo}")) com o
 * segredo "whsec_..." decodificado de base64.
 */
class WebhookSignature
{
    private const TOLERANCE_SECONDS = 300;

    public function __construct(private readonly ?string $secret) {}

    public function isValid(Request $request): bool
    {
        if (! $this->secret) {
            Log::error('Dodo webhook: DODO_PAYMENTS_WEBHOOK_KEY não configurado.');

            return false;
        }

        $id = (string) $request->header('webhook-id', '');
        $timestamp = (string) $request->header('webhook-timestamp', '');
        $header = (string) $request->header('webhook-signature', '');

        if ($id === '' || $header === '' || ! ctype_digit($timestamp)) {
            return false;
        }

        if (abs(time() - (int) $timestamp) > self::TOLERANCE_SECONDS) {
            return false;
        }

        $raw = str_starts_with($this->secret, 'whsec_') ? substr($this->secret, 6) : $this->secret;
        $key = base64_decode($raw, true);
        if ($key === false || $key === '') {
            return false;
        }

        $expected = base64_encode(hash_hmac('sha256', "{$id}.{$timestamp}.".$request->getContent(), $key, true));

        foreach (preg_split('/\s+/', trim($header)) ?: [] as $part) {
            if (str_starts_with($part, 'v1,') && hash_equals($expected, substr($part, 3))) {
                return true;
            }
        }

        return false;
    }
}
