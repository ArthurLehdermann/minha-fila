<?php

namespace App\Services\MercadoPago;

use Illuminate\Http\Request;

/**
 * Valida o header x-signature das notificações do Mercado Pago.
 *
 * O MP monta um manifest no formato "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 * e assina com HMAC-SHA256 usando a chave secreta do webhook. Sem essa
 * verificação qualquer um que descubra a URL consegue liberar acesso pago.
 */
class WebhookSignature
{
    public function __construct(private ?string $secret = null)
    {
        $this->secret ??= (string) config('mercadopago.webhook_secret');
    }

    /**
     * Sem segredo configurado a validação é pulada — é o caso de ambiente
     * local. Em produção o segredo é obrigatório e a ausência dele derruba
     * a requisição (ver MercadoPagoWebhookController).
     */
    public function configurado(): bool
    {
        return $this->secret !== null && $this->secret !== '';
    }

    public function valida(Request $request): bool
    {
        if (! $this->configurado()) {
            return false;
        }

        $partes = $this->parseSignature((string) $request->header('x-signature', ''));

        $ts = $partes['ts'] ?? null;
        $v1 = $partes['v1'] ?? null;

        if (! $ts || ! $v1) {
            return false;
        }

        $dataId = $request->query('data.id')
            ?? $request->query('data_id')
            ?? data_get($request->json()->all(), 'data.id');

        $dataId = $dataId === null ? '' : (string) $dataId;

        // A doc do MP manda normalizar para minúsculo quando o id é alfanumérico.
        if ($dataId !== '' && ! ctype_digit($dataId)) {
            $dataId = strtolower($dataId);
        }

        $requestId = (string) $request->header('x-request-id', '');

        $manifest = "id:{$dataId};request-id:{$requestId};ts:{$ts};";

        $esperado = hash_hmac('sha256', $manifest, $this->secret);

        return hash_equals($esperado, $v1);
    }

    /**
     * "ts=1704908010,v1=abc..." → ['ts' => '1704908010', 'v1' => 'abc...']
     */
    private function parseSignature(string $header): array
    {
        $partes = [];

        foreach (explode(',', $header) as $pedaco) {
            $par = explode('=', trim($pedaco), 2);

            if (count($par) === 2) {
                $partes[trim($par[0])] = trim($par[1]);
            }
        }

        return $partes;
    }
}
