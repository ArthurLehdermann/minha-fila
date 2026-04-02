<?php

namespace Tests\Feature\Companies;

use App\Models\Company;
use App\Models\OrderSequence;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResetSequenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_sequence_returns_200(): void
    {
        $company = Company::factory()->create();
        $this->postJson("/api/companies/{$company->id}/reset-sequence")->assertOk();
    }

    public function test_reset_sequence_returns_correct_payload(): void
    {
        $company = Company::factory()->create();
        $this->postJson("/api/companies/{$company->id}/reset-sequence")
            ->assertOk()->assertJson(['ok' => true, 'current_number' => 0]);
    }

    public function test_reset_sequence_zeroes_current_number(): void
    {
        $company = Company::factory()->create();
        OrderSequence::nextFor($company->id);
        OrderSequence::nextFor($company->id);
        $this->postJson("/api/companies/{$company->id}/reset-sequence");
        $seq = OrderSequence::where('company_id', $company->id)->first();
        $this->assertSame(0, $seq->current_number);
    }

    public function test_reset_sequence_nonexistent_company_returns_404(): void
    {
        $this->postJson('/api/companies/zzzzzz/reset-sequence')->assertNotFound();
    }
}
