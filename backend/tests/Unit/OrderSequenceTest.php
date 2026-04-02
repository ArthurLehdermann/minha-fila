<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\OrderSequence;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderSequenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_next_for_increments_number_and_sequence_id(): void
    {
        $company = Company::factory()->create();
        $first = OrderSequence::nextFor($company->id);
        $second = OrderSequence::nextFor($company->id);
        $this->assertSame(1, $first['number']);
        $this->assertSame(2, $second['number']);
        $this->assertSame(1, $first['sequence_id']);
        $this->assertSame(2, $second['sequence_id']);
    }

    public function test_next_for_is_isolated_between_companies(): void
    {
        $companyA = Company::factory()->create();
        $companyB = Company::factory()->create();
        $a = OrderSequence::nextFor($companyA->id);
        $b = OrderSequence::nextFor($companyB->id);
        $this->assertSame(1, $a['number']);
        $this->assertSame(1, $b['number']);
    }

    public function test_reset_for_zeroes_current_number(): void
    {
        $company = Company::factory()->create();
        OrderSequence::nextFor($company->id);
        OrderSequence::nextFor($company->id);
        OrderSequence::resetFor($company->id);
        $seq = OrderSequence::where('company_id', $company->id)->first();
        $this->assertSame(0, $seq->current_number);
    }

    public function test_sequence_id_continues_after_reset(): void
    {
        $company = Company::factory()->create();
        OrderSequence::nextFor($company->id);
        OrderSequence::resetFor($company->id);
        $next = OrderSequence::nextFor($company->id);
        $this->assertSame(1, $next['number']);
        $this->assertSame(2, $next['sequence_id']);
    }
}
