<?php

namespace App\Services\MercadoPago;

use Illuminate\Http\Client\Response;
use RuntimeException;

class MercadoPagoException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly int $statusHttp = 0,
        public readonly array $corpo = [],
    ) {
        parent::__construct($message, $statusHttp);
    }

    public static function daResposta(string $metodo, string $path, Response $response): self
    {
        $corpo = (array) $response->json();

        // O formato de erro do MP varia: ora "message", ora "error" + "cause".
        $detalhe = $corpo['message']
            ?? $corpo['error']
            ?? $response->body();

        if (! empty($corpo['cause']) && is_array($corpo['cause'])) {
            $causas = array_filter(array_map(
                fn ($c) => is_array($c) ? ($c['description'] ?? $c['code'] ?? null) : $c,
                $corpo['cause'],
            ));

            if ($causas) {
                $detalhe .= ' (' . implode('; ', $causas) . ')';
            }
        }

        return new self(
            sprintf('Mercado Pago %s %s falhou [%d]: %s', $metodo, $path, $response->status(), $detalhe),
            $response->status(),
            $corpo,
        );
    }
}
