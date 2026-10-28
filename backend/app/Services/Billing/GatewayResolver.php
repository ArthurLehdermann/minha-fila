<?php

namespace App\Services\Billing;

use App\Models\User;
use App\Services\Dodo\DodoClient;

/**
 * Escolhe o meio de pagamento: Mercado Pago (real) para pt_BR; Dodo (dólar)
 * para inglês e espanhol, quando a API key estiver configurada.
 */
class GatewayResolver
{
    public const MERCADO_PAGO = 'mercadopago';

    public const DODO = 'dodo';

    public function __construct(private readonly DodoClient $dodo) {}

    public function forUser(?User $user): string
    {
        $locale = $user?->locale ?: config('app.locale', 'pt_BR');

        if ($locale !== 'pt_BR' && $this->dodo->isConfigured()) {
            return self::DODO;
        }

        return self::MERCADO_PAGO;
    }

    public function forLocale(?string $locale): string
    {
        if ($locale && $locale !== 'pt_BR' && $this->dodo->isConfigured()) {
            return self::DODO;
        }

        return self::MERCADO_PAGO;
    }
}
