<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserProvider>
 */
class UserProviderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => 'google',
            'provider_id' => fake()->uuid(),
            'created_at' => now(),
        ];
    }

    public function google(): static
    {
        return $this->state([
            'provider' => 'google',
            'provider_id' => fake()->uuid(),
        ]);
    }

    public function magic(): static
    {
        return $this->state([
            'provider' => 'magic',
            'provider_id' => null,
        ]);
    }
}
