<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyIdTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_company_generates_sqid_id(): void
    {
        $owner = User::factory()->create();

        $company = Company::create([
            'owner_id' => $owner->id,
            'name' => 'Test Company',
        ]);

        $this->assertNotNull($company->id);
        $this->assertNotNull($company->id_int);
        
        // Sqid should be at least 5 chars (per our model config)
        $this->assertGreaterThanOrEqual(5, strlen($company->id));
        
        // It shouldn't be a random 6-char string anymore
        // It's deterministic based on id_int
        $reproducible = Company::generateShortId($company->id_int);
        $this->assertEquals($reproducible, $company->id);
    }

    public function test_same_id_int_always_results_in_same_id(): void
    {
        $id1 = Company::generateShortId(100);
        $id2 = Company::generateShortId(100);
        $id3 = Company::generateShortId(101);

        $this->assertEquals($id1, $id2);
        $this->assertNotEquals($id1, $id3);
    }
}
