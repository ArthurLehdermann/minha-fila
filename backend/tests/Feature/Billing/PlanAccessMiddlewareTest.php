<?php

namespace Tests\Feature\Billing;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlanAccessMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    private function userWithTrial(): User
    {
        return User::factory()->create([
            'trial_ends_at' => Carbon::now()->addDays(20),
        ]);
    }

    private function blockedUser(): User
    {
        return User::factory()->create([
            'trial_ends_at' => Carbon::now()->subDay(),
        ]);
    }

    // --- POST /api/companies (store) ---

    public function test_blocked_user_cannot_create_company(): void
    {
        $user = $this->blockedUser();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/companies', ['name' => 'Nova Fila']);

        $response->assertStatus(402)
            ->assertJsonPath('plan_status', 'blocked');
    }

    public function test_trial_user_can_create_company(): void
    {
        $user = $this->userWithTrial();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/companies', ['name' => 'Nova Fila']);

        $response->assertCreated();
    }

    // --- GET /api/companies (index) — should not be gated ---

    public function test_blocked_user_can_list_companies(): void
    {
        $user = $this->blockedUser();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/companies');

        $response->assertOk();
    }

    // --- DELETE /api/companies/{company} ---

    public function test_blocked_user_cannot_delete_company(): void
    {
        $user = $this->blockedUser();
        Sanctum::actingAs($user);
        $company = $user->companies()->create(['name' => 'Para deletar']);

        $response = $this->deleteJson("/api/companies/{$company->id}");

        $response->assertStatus(402);
    }

    // --- PATCH /api/companies/{company}/status ---

    public function test_blocked_user_cannot_toggle_company_status(): void
    {
        $user = $this->blockedUser();
        Sanctum::actingAs($user);
        $company = $user->companies()->create(['name' => 'Toggle']);

        $response = $this->patchJson("/api/companies/{$company->id}/status");

        $response->assertStatus(402);
    }

    // --- POST /api/companies/{company}/orders ---

    public function test_blocked_user_cannot_create_order(): void
    {
        $company = Company::factory()->create();
        $owner = $company->owner;
        $owner->trial_ends_at = Carbon::now()->subDay();
        $owner->save();
        Sanctum::actingAs($owner);

        $response = $this->postJson("/api/companies/{$company->id}/orders", [
            'label' => 'Mesa 1',
        ]);

        $response->assertStatus(402);
    }

    // --- GET /api/companies/{company}/orders — public, no gate ---

    public function test_public_can_list_orders_without_auth(): void
    {
        $company = Company::factory()->create();

        $response = $this->getJson("/api/companies/{$company->id}/orders");

        $response->assertOk();
    }

    // --- PATCH /api/orders/{order} ---

    public function test_blocked_user_cannot_update_order(): void
    {
        $company = Company::factory()->create();
        $order   = \App\Models\Order::factory()->forCompany($company)->create();
        $owner   = $company->owner;
        $owner->trial_ends_at = Carbon::now()->subDay();
        $owner->save();
        Sanctum::actingAs($owner);

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'called']);

        $response->assertStatus(402);
    }
}
