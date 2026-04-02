<?php

namespace Tests\Feature\Orders;

use App\Models\Company;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListOrdersTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->company = Company::factory()->create();
    }

    public function test_list_orders_returns_200(): void
    {
        $this->getJson("/api/companies/{$this->company->id}/orders")->assertOk();
    }

    public function test_list_orders_returns_array(): void
    {
        Order::factory()->forCompany($this->company)->count(3)->create();
        $this->getJson("/api/companies/{$this->company->id}/orders")->assertOk()->assertJsonCount(3);
    }

    public function test_list_orders_only_returns_company_orders(): void
    {
        $other = Company::factory()->create();
        Order::factory()->forCompany($this->company)->count(2)->create();
        Order::factory()->forCompany($other)->count(5)->create();
        $this->getJson("/api/companies/{$this->company->id}/orders")->assertOk()->assertJsonCount(2);
    }

    public function test_list_orders_returns_empty_array_when_no_orders(): void
    {
        $this->getJson("/api/companies/{$this->company->id}/orders")->assertOk()->assertExactJson([]);
    }

    public function test_list_orders_nonexistent_company_returns_404(): void
    {
        $this->getJson('/api/companies/zzzzzz/orders')->assertNotFound();
    }

    public function test_changes_endpoint_returns_orders_since_sequence_id(): void
    {
        Order::factory()->forCompany($this->company)->create(['sequence_id' => 10]);
        Order::factory()->forCompany($this->company)->create(['sequence_id' => 20]);
        Order::factory()->forCompany($this->company)->create(['sequence_id' => 30]);
        $this->getJson("/api/companies/{$this->company->id}/orders/changes?since=15")->assertOk()->assertJsonCount(2);
    }

    public function test_changes_endpoint_returns_empty_when_up_to_date(): void
    {
        Order::factory()->forCompany($this->company)->create(['sequence_id' => 10]);
        $this->getJson("/api/companies/{$this->company->id}/orders/changes?since=10")->assertOk()->assertExactJson([]);
    }

    public function test_changes_endpoint_only_returns_own_company_orders(): void
    {
        $other = Company::factory()->create();
        Order::factory()->forCompany($this->company)->create(['sequence_id' => 5]);
        Order::factory()->forCompany($other)->create(['sequence_id' => 5]);
        $this->getJson("/api/companies/{$this->company->id}/orders/changes?since=0")->assertOk()->assertJsonCount(1);
    }
}
