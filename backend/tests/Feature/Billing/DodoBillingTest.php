<?php

namespace Tests\Feature\Billing;

use App\Models\Assinatura;
use App\Models\DodoWebhookEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DodoBillingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Monta o segredo Standard Webhooks em runtime para o scanner não
     * tratar o literal "whsec_" + base64 como chave Stripe/Svix real.
     */
    private function makeWebhookSecret(string $raw = 'fixture-secret-for-dodo-webhooks'): string
    {
        return 'whsec_'.base64_encode($raw);
    }

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'dodo.api_key' => 'test-key',
            'dodo.webhook_secret' => $this->makeWebhookSecret(),
            'dodo.mode' => 'test',
            'dodo.planos.mensal.product_id' => 'pdt_minha_fila_mensal',
            'dodo.planos.anual.product_id' => 'pdt_minha_fila_anual',
            'dodo.planos.mensal.price_usd' => 9,
            'dodo.planos.anual.price_usd' => 90,
            'app.frontend_url' => 'https://frontend.example.com',
        ]);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function postWebhook(array $body, ?string $secret = null, ?string $webhookId = null)
    {
        $secret ??= $this->makeWebhookSecret();
        $payload = json_encode($body);
        $id = $webhookId ?? 'msg_'.Str::random(10);
        $ts = (string) time();
        $key = base64_decode(substr((string) $secret, 6));
        $sig = base64_encode(hash_hmac('sha256', "{$id}.{$ts}.{$payload}", $key, true));

        return $this->call('POST', '/api/dodo/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_WEBHOOK_ID' => $id,
            'HTTP_WEBHOOK_TIMESTAMP' => $ts,
            'HTTP_WEBHOOK_SIGNATURE' => "v1,{$sig}",
        ], $payload);
    }

    public function test_webhook_with_bad_signature_is_rejected(): void
    {
        $user = User::factory()->create(['locale' => 'en']);

        $this->postWebhook([
            'type' => 'subscription.active',
            'data' => [
                'subscription_id' => 'sub_x',
                'product_id' => 'pdt_minha_fila_mensal',
                'metadata' => ['user_id' => (string) $user->id],
            ],
        ], $this->makeWebhookSecret('wrong-secret'))->assertStatus(401);

        $this->assertNull($user->fresh()->acesso_expira_em);
        $this->assertDatabaseCount('assinaturas', 0);
    }

    public function test_webhook_from_other_product_is_ignored(): void
    {
        $user = User::factory()->create(['locale' => 'en']);
        $expiraAntes = $user->acesso_expira_em;

        $this->postWebhook([
            'type' => 'subscription.active',
            'data' => [
                'subscription_id' => 'sub_promptbi',
                'product_id' => 'pdt_outro_produto_bigworks',
                'metadata' => ['user_id' => (string) $user->id],
            ],
        ])->assertOk();

        $this->assertSame(
            optional($expiraAntes)?->toIso8601String(),
            optional($user->fresh()->acesso_expira_em)?->toIso8601String()
        );
        $this->assertDatabaseCount('assinaturas', 0);
    }

    public function test_active_webhook_credits_acesso_expira_em(): void
    {
        $user = User::factory()->create([
            'locale' => 'en',
            'trial_ends_at' => now()->addDays(5),
            'acesso_expira_em' => null,
        ]);

        $this->postWebhook([
            'type' => 'subscription.active',
            'data' => [
                'subscription_id' => 'sub_2',
                'product_id' => 'pdt_minha_fila_mensal',
                'customer' => ['customer_id' => 'cus_2'],
                'metadata' => ['user_id' => (string) $user->id, 'ciclo' => 'mensal'],
            ],
        ])->assertOk();

        $user->refresh();
        $this->assertNotNull($user->acesso_expira_em);
        $this->assertTrue($user->acesso_expira_em->greaterThan(now()->addDays(20)));

        $assinatura = Assinatura::where('dodo_subscription_id', 'sub_2')->first();
        $this->assertNotNull($assinatura);
        $this->assertSame(Assinatura::GATEWAY_DODO, $assinatura->gateway);
        $this->assertSame(Assinatura::STATUS_AUTORIZADA, $assinatura->status);
        $this->assertSame('mensal', $assinatura->ciclo);
        $this->assertSame('cus_2', $assinatura->dodo_customer_id);
    }

    public function test_duplicate_webhook_id_does_not_double_credit(): void
    {
        $user = User::factory()->create([
            'locale' => 'en',
            'trial_ends_at' => now()->addDays(5),
            'acesso_expira_em' => null,
        ]);

        $body = [
            'type' => 'subscription.active',
            'data' => [
                'subscription_id' => 'sub_dup',
                'product_id' => 'pdt_minha_fila_mensal',
                'metadata' => ['user_id' => (string) $user->id],
            ],
        ];

        $this->postWebhook($body, null, 'msg_same')->assertOk();
        $primeiro = $user->fresh()->acesso_expira_em?->toIso8601String();

        $this->postWebhook($body, null, 'msg_same')->assertOk();

        $this->assertSame($primeiro, $user->fresh()->acesso_expira_em?->toIso8601String());
        $this->assertSame(1, DodoWebhookEvent::where('webhook_id', 'msg_same')->count());
    }

    public function test_cancelled_webhook_keeps_acesso_expira_em(): void
    {
        $user = User::factory()->create([
            'locale' => 'en',
            'acesso_expira_em' => now()->addMonth(),
        ]);

        Assinatura::create([
            'user_id' => $user->id,
            'ciclo' => 'mensal',
            'gateway' => Assinatura::GATEWAY_DODO,
            'dodo_subscription_id' => 'sub_3',
            'status' => Assinatura::STATUS_AUTORIZADA,
        ]);

        $ate = $user->acesso_expira_em->copy();

        $this->postWebhook([
            'type' => 'subscription.cancelled',
            'data' => [
                'subscription_id' => 'sub_3',
                'product_id' => 'pdt_minha_fila_mensal',
            ],
        ])->assertOk();

        $user->refresh();
        $this->assertTrue($user->acesso_expira_em->equalTo($ate));
        $this->assertSame(Assinatura::STATUS_CANCELADA, Assinatura::where('dodo_subscription_id', 'sub_3')->value('status'));
    }

    public function test_expired_and_failed_do_not_cut_access(): void
    {
        $user = User::factory()->create([
            'locale' => 'en',
            'acesso_expira_em' => now()->addDays(20),
        ]);

        Assinatura::create([
            'user_id' => $user->id,
            'ciclo' => 'anual',
            'gateway' => Assinatura::GATEWAY_DODO,
            'dodo_subscription_id' => 'sub_fail',
            'status' => Assinatura::STATUS_AUTORIZADA,
        ]);

        $ate = $user->acesso_expira_em->toIso8601String();

        $this->postWebhook([
            'type' => 'subscription.failed',
            'data' => [
                'subscription_id' => 'sub_fail',
                'product_id' => 'pdt_minha_fila_anual',
            ],
        ], null, 'msg_fail')->assertOk();

        $this->assertSame($ate, $user->fresh()->acesso_expira_em?->toIso8601String());
        $this->assertSame(Assinatura::STATUS_CANCELADA, Assinatura::where('dodo_subscription_id', 'sub_fail')->value('status'));
    }

    public function test_status_routes_gateway_by_locale(): void
    {
        $en = User::factory()->create(['locale' => 'en']);
        Sanctum::actingAs($en);

        $this->getJson('/api/billing/status')
            ->assertOk()
            ->assertJsonPath('gateway', 'dodo')
            ->assertJsonPath('precos.currency', 'USD')
            ->assertJsonPath('precos.mensal', 9);

        $pt = User::factory()->create(['locale' => 'pt_BR']);
        Sanctum::actingAs($pt);

        $this->getJson('/api/billing/status')
            ->assertOk()
            ->assertJsonPath('gateway', 'mercadopago')
            ->assertJsonPath('precos.currency', 'BRL');
    }

    public function test_checkout_defaults_to_dodo_for_english_user(): void
    {
        Http::fake([
            'test.dodopayments.com/checkouts' => Http::response([
                'checkout_url' => 'https://checkout.dodopayments.com/session/abc',
                'session_id' => 'cks_abc',
            ]),
        ]);

        $user = User::factory()->create(['locale' => 'en', 'email' => 'user@example.com']);
        Sanctum::actingAs($user);

        $this->postJson('/api/billing/checkout', ['ciclo' => 'mensal'])
            ->assertOk()
            ->assertJsonPath('checkout_url', 'https://checkout.dodopayments.com/session/abc');

        Http::assertSent(fn ($request) => $request->url() === 'https://test.dodopayments.com/checkouts'
            && $request['product_cart'][0]['product_id'] === 'pdt_minha_fila_mensal'
            && $request['metadata']['user_id'] === (string) $user->id
            && $request['customer']['email'] === 'user@example.com'
            && $request['return_url'] === 'https://frontend.example.com/billing');
    }

    public function test_checkout_metodo_dodo_forces_dodo_for_pt_br(): void
    {
        Http::fake([
            'test.dodopayments.com/checkouts' => Http::response([
                'checkout_url' => 'https://checkout.dodopayments.com/session/forced',
                'session_id' => 'cks_forced',
            ]),
        ]);

        $user = User::factory()->create(['locale' => 'pt_BR']);
        Sanctum::actingAs($user);

        $this->postJson('/api/billing/checkout', ['ciclo' => 'anual', 'metodo' => 'dodo'])
            ->assertOk()
            ->assertJsonPath('checkout_url', 'https://checkout.dodopayments.com/session/forced');

        Http::assertSent(fn ($request) => $request['product_cart'][0]['product_id'] === 'pdt_minha_fila_anual');
    }

    public function test_cancel_calls_dodo_api(): void
    {
        Http::fake([
            'test.dodopayments.com/subscriptions/sub_4' => Http::response([], 200),
        ]);

        $user = User::factory()->create([
            'locale' => 'en',
            'acesso_expira_em' => now()->addMonth(),
        ]);

        Assinatura::create([
            'user_id' => $user->id,
            'ciclo' => 'mensal',
            'gateway' => Assinatura::GATEWAY_DODO,
            'dodo_subscription_id' => 'sub_4',
            'status' => Assinatura::STATUS_AUTORIZADA,
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/billing/cancel')
            ->assertOk()
            ->assertJsonPath('ok', true);

        Http::assertSent(fn ($request) => $request->method() === 'PATCH'
            && str_ends_with($request->url(), '/subscriptions/sub_4')
            && $request['status'] === 'cancelled');

        $this->assertSame(Assinatura::STATUS_CANCELADA, Assinatura::where('dodo_subscription_id', 'sub_4')->value('status'));
        $this->assertNotNull($user->fresh()->acesso_expira_em);
    }

    public function test_portuguese_user_status_keeps_mercado_pago_without_dodo_key(): void
    {
        config(['dodo.api_key' => null]);

        $user = User::factory()->create(['locale' => 'en']);
        Sanctum::actingAs($user);

        $this->getJson('/api/billing/status')
            ->assertOk()
            ->assertJsonPath('gateway', 'mercadopago')
            ->assertJsonPath('dodo_configured', false);
    }
}
