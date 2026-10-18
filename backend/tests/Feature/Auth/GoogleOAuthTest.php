<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleOAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_returns_redirect(): void
    {
        $response = $this->get('/auth/google/redirect');

        $response->assertRedirect();
    }

    public function test_google_callback_creates_user_and_provider_on_first_access(): void
    {
        $this->mockSocialiteUser('google-id-001', 'newuser@example.com', 'New User');

        $this->get('/auth/google/callback?code=test-code');

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
        $this->assertDatabaseHas('user_providers', [
            'provider' => 'google',
            'provider_id' => 'google-id-001',
        ]);
    }

    public function test_google_callback_does_not_duplicate_user_with_same_email(): void
    {
        $existing = User::factory()->create(['email' => 'existing@example.com']);

        $this->mockSocialiteUser('google-id-002', 'existing@example.com', 'Existing User');

        $this->get('/auth/google/callback?code=test-code');

        $this->assertSame(1, User::where('email', 'existing@example.com')->count());
    }

    public function test_google_callback_links_provider_to_existing_user(): void
    {
        $existing = User::factory()->create(['email' => 'linkme@example.com']);

        $this->mockSocialiteUser('google-id-003', 'linkme@example.com', 'Link Me');

        $this->get('/auth/google/callback?code=test-code');

        $this->assertDatabaseHas('user_providers', [
            'user_id' => $existing->id,
            'provider' => 'google',
            'provider_id' => 'google-id-003',
        ]);
    }

    public function test_google_callback_does_not_auto_create_company(): void
    {
        $this->mockSocialiteUser('google-id-004', 'nocompany@example.com', 'No Company');

        $this->get('/auth/google/callback?code=test-code');

        $user = User::where('email', 'nocompany@example.com')->first();
        $this->assertSame(0, $user->companies()->count());
    }

    public function test_google_callback_sets_trial_ends_at_for_new_user(): void
    {
        $this->mockSocialiteUser('google-id-trial', 'trialuser@example.com', 'Trial User');

        Carbon::setTestNow(Carbon::parse('2025-01-01 12:00:00'));

        $this->get('/auth/google/callback?code=test-code');

        $user = User::where('email', 'trialuser@example.com')->first();
        $this->assertNotNull($user->trial_ends_at);
        $this->assertTrue($user->trial_ends_at->isSameDay(Carbon::now()->addDays(30)));

        Carbon::setTestNow();
    }

    public function test_google_callback_does_not_overwrite_trial_for_existing_user(): void
    {
        $existingTrialEnd = Carbon::parse('2099-06-15');
        User::factory()->create([
            'email' => 'existing-google@example.com',
            'trial_ends_at' => $existingTrialEnd,
        ]);

        $this->mockSocialiteUser('google-id-existing', 'existing-google@example.com', 'Existing');

        $this->get('/auth/google/callback?code=test-code');

        $user = User::where('email', 'existing-google@example.com')->first();
        $this->assertTrue($user->trial_ends_at->isSameDay($existingTrialEnd));
    }

    public function test_google_callback_response_does_not_include_company_uuid(): void
    {
        $this->mockSocialiteUser('google-id-006', 'nouuid@example.com', 'No UUID');

        $response = $this->getJson('/auth/google/callback?code=test-code');

        $response->assertOk()
            ->assertJsonMissingPath('user.company_uuid');
    }

    public function test_google_callback_returns_token(): void
    {
        $this->mockSocialiteUser('google-id-005', 'tokentest@example.com', 'Token Test');

        $response = $this->getJson('/auth/google/callback?code=test-code');

        $response->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_google_callback_without_code_and_with_token_user_redirects_to_frontend(): void
    {
        config([
            'app.frontend_url' => 'https://frontend.example.com',
            'app.url' => 'https://backend.example.com',
        ]);

        $response = $this->get('/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');

        $response->assertRedirect('https://frontend.example.com/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');
    }

    public function test_google_callback_without_code_and_with_token_user_returns_bridge_when_same_origin(): void
    {
        config([
            'app.frontend_url' => 'https://minha-fila.meugarcom.app',
            'app.url' => 'https://minha-fila.meugarcom.app',
        ]);

        $response = $this->get('https://minha-fila.meugarcom.app/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');

        $response->assertOk()
            ->assertSee('Concluindo login com Google...')
            ->assertSee("localStorage.setItem('auth_token'", false)
            ->assertSee("window.location.replace('/filas')", false);
    }

    public function test_google_callback_redirect_does_not_forward_legacy_redirect_flag(): void
    {
        config([
            'app.frontend_url' => 'https://frontend.example.com',
            'app.url' => 'https://backend.example.com',
        ]);

        $response = $this->get('/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D&_redirected=1');

        $response->assertRedirect('https://frontend.example.com/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');
    }


    public function test_google_callback_without_code_stops_redirect_loop_after_one_hop(): void
    {
        config([
            'app.frontend_url' => 'https://frontend.example.com',
            'app.url' => 'https://backend.example.com',
        ]);

        $response = $this->get('/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');

        $response->assertRedirect('https://frontend.example.com/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');
        $response->assertCookie('oauth_google_callback_redirected', '1');

        $secondHop = $this->withCookie('oauth_google_callback_redirected', '1')
            ->get('https://backend.example.com/auth/google/callback?token=abc123&user=%7B%22id%22%3A%221%22%7D');

        $secondHop->assertOk()
            ->assertSee('Concluindo login com Google...');
    }


    public function test_google_callback_without_code_returns_validation_error_for_json_requests(): void
    {
        $response = $this->getJson('/auth/google/callback');

        $response->assertUnprocessable()
            ->assertJson([
                'message' => 'Google callback inválido: parâmetro "code" ausente.',
            ]);
    }

    private function mockSocialiteUser(string $id, string $email, string $name): void
    {
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn($id);
        $socialiteUser->shouldReceive('getEmail')->andReturn($email);
        $socialiteUser->shouldReceive('getName')->andReturn($name);

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
    }
}
