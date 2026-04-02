<?php

namespace Tests\Feature\Orders;

use App\Models\Company;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
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
        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'preparing']);
        $response->assertOk();
    }

    public function test_update_order_returns_updated_status(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'ready']);
        $response->assertOk()->assertJsonFragment(['status' => 'ready']);
    }

    public function test_update_order_persists_in_database(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        $this->patchJson("/api/orders/{$order->id}", ['status' => 'done']);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'done']);
    }

    public function test_update_order_with_invalid_status_returns_422(): void
    {
        $order = Order::factory()->forCompany($this->company)->create();
        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'invalid']);
        $response->assertUnprocessable()->assertJsonValidationErrors(['status']);
    }

    public function test_update_nonexistent_order_returns_404(): void
    {
        $response = $this->patchJson('/api/orders/nonexistent-id', ['status' => 'ready']);
        $response->assertNotFound();
    }

    public function test_update_order_updates_sequence_id(): void
    {
        $order = Order::factory()->forCompany($this->company)->create(['sequence_id' => 0]);
        $response = $this->patchJson("/api/orders/{$order->id}", ['status' => 'preparing']);
        $this->assertGreaterThan(0, $response->json('sequence_id'));
    }

    public function test_update_order_dispatches_broadcast_event(): void
    {
        Event::fake();
        $order = Order::factory()->forCompany($this->company)->create();
        $this->patchJson("/api/orders/{$order->id}", ['status' => 'preparing']);
        Event::assertDispatched(\App\Events\OrderUpdated::class);
    }

    public function test_all_valid_status_transitions(): void
    {
        foreach (['waiting', 'preparing', 'ready', 'done'] as $status) {
            $order = Order::factory()->forCompany($this->company)->create();
            $response = $this->patchJson("/api/orders/{$order->id}", ['status' => $status]);
            $response->assertOk()->assertJsonFragment(['status' => $status]);
        }
    }
}
