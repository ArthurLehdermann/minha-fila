<?php

namespace Tests\Feature\Companies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompanyLimitsTest extends TestCase
{
    use RefreshDatabase;

    // --- store limits ---

    public function test_store_creates_company_with_active_status_by_default(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/companies', ['name' => 'Minha Fila']);

        $response->assertCreated()
            ->assertJsonPath('status', 'active');
    }

    public function test_store_rejects_when_total_reaches_10(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Create 5 active + 5 inactive = 10 total
        for ($i = 0; $i < 5; $i++) {
            $user->companies()->create(['name' => "Ativa $i", 'status' => 'active']);
        }
        for ($i = 0; $i < 5; $i++) {
            $user->companies()->create(['name' => "Inativa $i", 'status' => 'inactive']);
        }

        $response = $this->postJson('/api/companies', ['name' => 'Uma a mais']);

        $response->assertUnprocessable()
            ->assertJsonPath('message', 'Limite de 10 filas atingido.');
    }

    public function test_store_rejects_when_active_reaches_5(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        for ($i = 0; $i < 5; $i++) {
            $user->companies()->create(['name' => "Ativa $i", 'status' => 'active']);
        }

        $response = $this->postJson('/api/companies', ['name' => 'Sexta ativa']);

        $response->assertUnprocessable()
            ->assertJsonPath('message', 'Limite de 5 filas ativas atingido.');
    }

    public function test_store_allows_new_company_after_deactivating_one(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        for ($i = 0; $i < 5; $i++) {
            $user->companies()->create(['name' => "Ativa $i", 'status' => 'active']);
        }

        // Deactivate one
        $user->companies()->first()->update(['status' => 'inactive']);

        $response = $this->postJson('/api/companies', ['name' => 'Nova após inativação']);

        $response->assertCreated();
    }

    // --- toggleStatus ---

    public function test_toggle_status_deactivates_active_company(): void
    {
        $company = Company::factory()->create(['status' => 'active']);
        Sanctum::actingAs($company->owner);

        $response = $this->patchJson("/api/companies/{$company->id}/status");

        $response->assertOk()
            ->assertJsonPath('status', 'inactive');
        $this->assertDatabaseHas('companies', ['id' => $company->id, 'status' => 'inactive']);
    }

    public function test_toggle_status_activates_inactive_company(): void
    {
        $company = Company::factory()->create(['status' => 'inactive']);
        Sanctum::actingAs($company->owner);

        $response = $this->patchJson("/api/companies/{$company->id}/status");

        $response->assertOk()
            ->assertJsonPath('status', 'active');
        $this->assertDatabaseHas('companies', ['id' => $company->id, 'status' => 'active']);
    }

    public function test_toggle_status_rejects_reactivation_when_already_5_active(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        for ($i = 0; $i < 5; $i++) {
            $user->companies()->create(['name' => "Ativa $i", 'status' => 'active']);
        }
        $inactive = $user->companies()->create(['name' => 'Inativa', 'status' => 'inactive']);

        $response = $this->patchJson("/api/companies/{$inactive->id}/status");

        $response->assertUnprocessable()
            ->assertJsonPath('message', 'Limite de 5 filas ativas atingido.');
    }

    public function test_toggle_status_requires_auth(): void
    {
        $company = Company::factory()->create();

        $response = $this->patchJson("/api/companies/{$company->id}/status");

        $response->assertUnauthorized();
    }

    public function test_toggle_status_forbids_other_user(): void
    {
        $company = Company::factory()->create();
        $intruder = User::factory()->create();
        Sanctum::actingAs($intruder);

        $response = $this->patchJson("/api/companies/{$company->id}/status");

        $response->assertForbidden();
    }

    // --- scopeActive ---

    public function test_scope_active_returns_only_active_companies(): void
    {
        $user = User::factory()->create();
        $user->companies()->create(['name' => 'Ativa', 'status' => 'active']);
        $user->companies()->create(['name' => 'Inativa', 'status' => 'inactive']);

        $active = $user->companies()->active()->get();

        $this->assertCount(1, $active);
        $this->assertSame('Ativa', $active->first()->name);
    }
}
