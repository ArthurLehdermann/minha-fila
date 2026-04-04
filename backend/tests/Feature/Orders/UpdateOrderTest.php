<?php

namespace Tests\Feature\Orders;

use App\Models\Company;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UpdateOrderTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->company = Company::factory()->create();
    }

    public function test_update_order_status_returns_200(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        Sanctum::actingAs($this->company->owner);

        $response = $this->patchJson("/api/orders/{$order->id}", [
            'status' => 'preparing',
        ]);

        $response->assertOk();
    }

    public function test_update_order_returns_updated_status(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        Sanctum::actingAs($this->company->owner);

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'ready']);

        $response->assertOk()
            ->assertJsonFragment(['status' => 'ready']);
    }

    public function test_update_order_persists_in_database(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        Sanctum::actingAs($this->company->owner);

        $this->patchJson("/api/orders/{$order->id}", ['status' => 'done']);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'done',
        ]);
    }

    public function test_update_order_with_invalid_status_returns_422(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        Sanctum::actingAs($this->company->owner);

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'invalid']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_update_nonexistent_order_returns_404(): void
    {
        Sanctum::actingAs($this->company->owner);

        $response = $this->patchJson('/api/orders/nonexistent-id', ['status' => 'ready']);

        $response->assertNotFound();
    }

    public function test_update_order_updates_sequence_id(): void
    {
        $order = Order::factory()->forCompany($this->company)->create(['sequence_id' => 0]);
        Sanctum::actingAs($this->company->owner);

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'preparing']);

        $newSeqId = $response->json('sequence_id');
        $this->assertGreaterThan(0, $newSeqId);
    }

    public function test_update_order_dispatches_broadcast_event(): void
    {
        Event::fake();

        $order = Order::factory()->forCompany($this->company)->create();
        Sanctum::actingAs($this->company->owner);

        $this->patchJson("/api/orders/{$order->id}", ['status' => 'preparing']);

        Event::assertDispatched(\App\Events\OrderUpdated::class);
    }

    public function test_all_valid_status_transitions(): void
    {
        Sanctum::actingAs($this->company->owner);

        foreach (['waiting', 'preparing', 'ready', 'done'] as $status) {
            $order = Order::factory()->forCompany($this->company)->create();

            $response = $this->patchJson("/api/orders/{$order->id}", ['status' => $status]);

            $response->assertOk()->assertJsonFragment(['status' => $status]);
        }
    }

    public function test_update_order_without_auth_returns_401(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'ready']);

        $response->assertUnauthorized();
    }

    public function test_update_order_from_another_company_returns_403(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        $intruder = User::factory()->create();
        $intruder->companies()->create(['name' => 'Outra empresa']);
        Sanctum::actingAs($intruder);

        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'ready']);

        $response->assertForbidden();
    }
}
