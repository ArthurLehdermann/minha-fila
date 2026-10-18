<?php

namespace Tests\Feature\MercadoPago;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WebhookRecursoInexistenteTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'mercadopago.access_token'   => 'TEST-token',
            'mercadopago.webhook_secret' => null,
            'mercadopago.base_url'       => 'https://api.mercadopago.com',
        ]);
    }

    public function test_pagamento_inexistente_no_mp_responde_200_ignorado(): void
    {
        Http::fake([
            'api.mercadopago.com/v1/payments/123456' => Http::response(['message' => 'Payment not found'], 404),
        ]);

        $this->postJson('/api/mercadopago/webhook', [
            'type' => 'payment',
            'data' => ['id' => '123456'],
        ])->assertOk()->assertJson(['ignorado' => true]);
    }

    public function test_falha_transitoria_do_mp_continua_500_para_reenvio(): void
    {
        Http::fake([
            'api.mercadopago.com/v1/payments/123456' => Http::response(['message' => 'internal'], 503),
        ]);

        $this->postJson('/api/mercadopago/webhook', [
            'type' => 'payment',
            'data' => ['id' => '123456'],
        ])->assertStatus(500);
    }
}
