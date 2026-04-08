<?php

namespace Tests\Feature\Billing;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Subscription;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BillingStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_status_requires_authentication(): void
    {
        $response = $this->getJson('/api/billing/status');

        $response->assertUnauthorized();
    }

    public function test_status_returns_trial_for_user_within_trial_period(): void
    {
        $user = User::factory()->create([
            'trial_ends_at' => Carbon::now()->addDays(20),
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/status');

        $response->assertOk()
            ->assertJsonPath('plan_status', 'trial')
            ->assertJsonStructure(['plan_status', 'trial_ends_at', 'renews_at', 'stripe_status', 'cancel_at_period_end']);
    }

    public function test_status_returns_blocked_when_trial_expired_and_no_subscription(): void
    {
        $user = User::factory()->create([
            'trial_ends_at' => Carbon::now()->subDay(),
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/status');

        $response->assertOk()
            ->assertJsonPath('plan_status', 'blocked');
    }

    public function test_status_returns_blocked_when_no_trial_and_no_subscription(): void
    {
        $user = User::factory()->create(['trial_ends_at' => null]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/status');

        $response->assertOk()
            ->assertJsonPath('plan_status', 'blocked');
    }

    public function test_status_trial_ends_at_is_iso8601(): void
    {
        $user = User::factory()->create([
            'trial_ends_at' => Carbon::parse('2025-06-01 00:00:00'),
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/billing/status');

        $response->assertOk();
        $this->assertStringStartsWith('2025-06-01', $response->json('trial_ends_at'));
    }
}
