<?php

namespace Tests\Feature\Auth;

use App\Models\MagicLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class MagicLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_magic_link_with_valid_email_returns_204(): void
    {
        Mail::fake();
        RateLimiter::clear('magic-link:' . sha1('test@example.com|127.0.0.1'));

        $response = $this->postJson('/auth/magic-link', ['email' => 'test@example.com']);

        $response->assertNoContent();
    }

    public function test_send_magic_link_creates_record_in_database(): void
    {
        Mail::fake();
        RateLimiter::clear('magic-link:' . sha1('test@example.com|127.0.0.1'));

        $this->postJson('/auth/magic-link', ['email' => 'test@example.com']);

        $this->assertDatabaseHas('magic_links', ['email' => 'test@example.com']);
    }

    public function test_send_magic_link_with_invalid_email_returns_422(): void
    {
        RateLimiter::clear('magic-link:' . sha1('not-an-email|127.0.0.1'));

        $response = $this->postJson('/auth/magic-link', ['email' => 'not-an-email']);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_send_magic_link_without_email_returns_422(): void
    {
        $response = $this->postJson('/auth/magic-link', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_verify_valid_token_authenticates_user(): void
    {
        $token = 'valid-token-123';
        MagicLink::create([
            'email' => 'user@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $response = $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=user@example.com');

        $response->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_verify_creates_user_if_not_exists(): void
    {
        $token = 'new-user-token';
        MagicLink::create([
            'email' => 'newuser@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=newuser@example.com');

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }

    public function test_verify_marks_token_as_used(): void
    {
        $token = 'use-me-token';
        MagicLink::create([
            'email' => 'mark@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=mark@example.com');

        $link = MagicLink::where('email', 'mark@example.com')->first();
        $this->assertNotNull($link->used_at);
    }

    public function test_verify_expired_token_returns_422(): void
    {
        $token = 'expired-token';
        MagicLink::create([
            'email' => 'expired@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->subMinutes(1),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $response = $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=expired@example.com');

        $response->assertUnprocessable();
    }

    public function test_verify_already_used_token_returns_422(): void
    {
        $token = 'used-token';
        MagicLink::create([
            'email' => 'used@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => Carbon::now(),
            'created_at' => Carbon::now(),
        ]);

        $response = $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=used@example.com');

        $response->assertUnprocessable();
    }

    public function test_verify_wrong_token_returns_422(): void
    {
        MagicLink::create([
            'email' => 'wrong@example.com',
            'token_hash' => MagicLink::hash('correct-token'),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $response = $this->getJson('/auth/magic-link/verify?token=wrong-token&email=wrong@example.com');

        $response->assertUnprocessable();
    }

    public function test_first_access_does_not_auto_create_company(): void
    {
        $token = 'first-time-token';
        MagicLink::create([
            'email' => 'firsttime@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=firsttime@example.com');

        $user = User::where('email', 'firsttime@example.com')->first();
        $this->assertSame(0, $user->companies()->count());
    }

    public function test_new_user_receives_trial_ends_at_30_days(): void
    {
        $token = 'trial-token';
        MagicLink::create([
            'email' => 'trial@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        Carbon::setTestNow(Carbon::parse('2025-01-01 12:00:00'));

        $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=trial@example.com');

        $user = User::where('email', 'trial@example.com')->first();
        $this->assertNotNull($user->trial_ends_at);
        $this->assertTrue($user->trial_ends_at->isSameDay(Carbon::now()->addDays(30)));

        Carbon::setTestNow();
    }

    public function test_existing_user_does_not_overwrite_trial_ends_at(): void
    {
        $existingTrialEnd = Carbon::parse('2099-12-31');
        $existing = User::factory()->create([
            'email' => 'existing-trial@example.com',
            'trial_ends_at' => $existingTrialEnd,
        ]);

        $token = 'existing-user-token';
        MagicLink::create([
            'email' => 'existing-trial@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=existing-trial@example.com');

        $existing->refresh();
        $this->assertTrue($existing->trial_ends_at->isSameDay($existingTrialEnd));
    }

    public function test_verify_response_does_not_include_company_uuid(): void
    {
        $token = 'no-company-token';
        MagicLink::create([
            'email' => 'nocompany@example.com',
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes(15),
            'used_at' => null,
            'created_at' => Carbon::now(),
        ]);

        $response = $this->getJson('/auth/magic-link/verify?token=' . $token . '&email=nocompany@example.com');

        $response->assertOk()
            ->assertJsonMissingPath('user.company_uuid');
    }

    public function test_send_magic_link_is_rate_limited_after_five_attempts(): void
    {
        Mail::fake();
        $email = 'limit@example.com';
        $rateKey = 'magic-link:' . sha1($email . '|127.0.0.1');
        RateLimiter::clear($rateKey);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/auth/magic-link', ['email' => $email])->assertNoContent();
        }

        $this->postJson('/auth/magic-link', ['email' => $email])
            ->assertStatus(429);
    }

    public function test_send_magic_link_rate_limit_is_case_insensitive_for_email(): void
    {
        Mail::fake();
        $upper = 'LIMIT@EXAMPLE.COM';
        $lower = 'limit@example.com';
        $rateKey = 'magic-link:' . sha1($lower . '|127.0.0.1');
        RateLimiter::clear($rateKey);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/auth/magic-link', ['email' => $upper])->assertNoContent();
        }

        $this->postJson('/auth/magic-link', ['email' => $lower])
            ->assertStatus(429);
    }
}
