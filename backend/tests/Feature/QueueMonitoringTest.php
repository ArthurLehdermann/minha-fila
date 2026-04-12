<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QueueMonitoringTest extends TestCase
{
    use RefreshDatabase;

    public function test_queue_monitoring_endpoint_returns_aggregated_counts(): void
    {
        $company = Company::factory()->create();

        Order::factory()->forCompany($company)->create(['status' => 'waiting']);
        Order::factory()->forCompany($company)->create(['status' => 'preparing']);
        Order::factory()->forCompany($company)->count(2)->create(['status' => 'ready']);
        Order::factory()->forCompany($company)->create(['status' => 'done']);

        $response = $this->getJson("/api/monitoring/companies/{$company->id}/queue");

        $response->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('counts.waiting', 1)
            ->assertJsonPath('counts.preparing', 1)
            ->assertJsonPath('counts.ready', 2)
            ->assertJsonPath('counts.done', 1)
            ->assertJsonPath('totals.active', 4);
    }
}
