<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        static $sequence = 0;

        return [
            'company_id' => Company::factory(),
            'number' => fake()->numberBetween(1, 999),
            'label' => fake()->words(3, true),
            'status' => 'waiting',
            'sequence_id' => ++$sequence,
        ];
    }

    public function waiting(): static
    {
        return $this->state(['status' => 'waiting']);
    }

    public function preparing(): static
    {
        return $this->state(['status' => 'preparing']);
    }

    public function ready(): static
    {
        return $this->state(['status' => 'ready']);
    }

    public function done(): static
    {
        return $this->state(['status' => 'done']);
    }

    public function forCompany(Company $company): static
    {
        return $this->state(['company_id' => $company->id]);
    }
}
