<?php

namespace Tests\Feature\Orders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CreateOrderTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->company = Company::factory()->create();
    }

    public function test_create_order_returns_201(): void
    {
        $response = $this->postJson("/api/companies/{$this->company->id}/orders", [
            'label' => 'Crepe de frango',
        ]);

        $response->assertCreated();
    }

    public function test_create_order_returns_correct_structure(): void
    {
        $response = $this->postJson("/api/companies/{$this->company->id}/orders", [
            'label' => 'Crepe de frango',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'id',
                'company_uuid',
                'label',
                'status',
                'number',
                'sequence_id',
                'created_at',
                'updated_at',
            ]);
    }

    public function test_create_order_has_waiting_status_by_default(): void
    {
        $response = $this->postJson("/api/companies/{$this->company->id}/orders", [
            'label' => 'Açaí',
        ]);

        $response->assertCreated()
            ->assertJsonFragment(['status' => 'waiting']);
    }

    public function test_create_order_persists_in_database(): void
    {
        $this->postJson("/api/companies/{$this->company->id}/orders", [
            'label' => 'Tapioca',
        ]);

        $this->assertDatabaseHas('orders', [
            'company_id' => $this->company->id,
            'label' => 'Tapioca',
        ]);
    }

    public function test_order_number_increments_per_company(): void
    {
        $first = $this->postJson("/api/companies/{$this->company->id}/orders", ['label' => 'A']);
        $second = $this->postJson("/api/companies/{$this->company->id}/orders", ['label' => 'B']);

        $this->assertSame(1, $first->json('number'));
        $this->assertSame(2, $second->json('number'));
    }

    public function test_order_number_isolated_between_companies(): void
    {
        $other = Company::factory()->create();

        $first = $this->postJson("/api/companies/{$this->company->id}/orders", ['label' => 'A']);
        $second = $this->postJson("/api/companies/{$other->id}/orders", ['label' => 'B']);

        $this->assertSame(1, $first->json('number'));
        $this->assertSame(1, $second->json('number'));
    }

    public function test_create_order_without_label_returns_422(): void
    {
        $response = $this->postJson("/api/companies/{$this->company->id}/orders", []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['label']);
    }

    public function test_create_order_with_nonexistent_company_returns_404(): void
    {
        $response = $this->postJson('/api/companies/zzzzzz/orders', [
            'label' => 'Test',
        ]);

        $response->assertNotFound();
    }

    public function test_create_order_dispatches_broadcast_event(): void
    {
        Event::fake();

        $this->postJson("/api/companies/{$this->company->id}/orders", ['label' => 'Teste']);

        Event::assertDispatched(\App\Events\OrderUpdated::class);
    }
}
