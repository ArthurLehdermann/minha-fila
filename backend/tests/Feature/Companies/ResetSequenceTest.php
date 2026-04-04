<?php

namespace Tests\Feature\Companies;

use App\Models\Company;
use App\Models\OrderSequence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResetSequenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_sequence_returns_200(): void
    {
        $company = Company::factory()->create();
        Sanctum::actingAs($company->owner);

        $response = $this->postJson("/api/companies/{$company->id}/reset-sequence");

        $response->assertOk();
    }

    public function test_reset_sequence_returns_correct_payload(): void
    {
        $company = Company::factory()->create();
        Sanctum::actingAs($company->owner);

        $response = $this->postJson("/api/companies/{$company->id}/reset-sequence");

        $response->assertOk()
            ->assertJson(['ok' => true, 'current_number' => 0]);
    }

    public function test_reset_sequence_zeroes_current_number(): void
    {
        $company = Company::factory()->create();
        Sanctum::actingAs($company->owner);
        OrderSequence::nextFor($company->id);
        OrderSequence::nextFor($company->id);

        $this->postJson("/api/companies/{$company->id}/reset-sequence");

        $seq = OrderSequence::where('company_id', $company->id)->first();
        $this->assertSame(0, $seq->current_number);
    }

    public function test_reset_sequence_nonexistent_company_returns_404(): void
    {
        $company = Company::factory()->create();
        Sanctum::actingAs($company->owner);

        $response = $this->postJson('/api/companies/zzzzzz/reset-sequence');

        $response->assertNotFound();
    }

    public function test_reset_sequence_without_auth_returns_401(): void
    {
        $company = Company::factory()->create();

        $response = $this->postJson("/api/companies/{$company->id}/reset-sequence");

        $response->assertUnauthorized();
    }

    public function test_reset_sequence_from_another_company_returns_403(): void
    {
        $company = Company::factory()->create();
        $intruder = User::factory()->create();
        $intruder->companies()->create(['name' => 'Outra empresa']);
        Sanctum::actingAs($intruder);

        $response = $this->postJson("/api/companies/{$company->id}/reset-sequence");

        $response->assertForbidden();
    }
}
