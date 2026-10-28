<?php

namespace Tests\Feature;

use App\Mail\MagicLinkMail;
use App\Models\User;
use App\Support\Locale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_default_locale_is_pt_br(): void
    {
        $this->getJson('/api/health');

        $this->assertSame(Locale::DEFAULT, App::getLocale());
    }

    public function test_accept_language_sets_locale_when_guest(): void
    {
        $this->withHeader('Accept-Language', 'en-US,en;q=0.9')
            ->getJson('/api/health');

        $this->assertSame('en', App::getLocale());
    }

    public function test_x_locale_header_overrides_accept_language(): void
    {
        $this->withHeaders([
            'Accept-Language' => 'en-US',
            'X-Locale' => 'es',
        ])->getJson('/api/health');

        $this->assertSame('es', App::getLocale());
    }

    public function test_authenticated_user_locale_wins_over_headers(): void
    {
        $user = User::factory()->create(['locale' => 'pt_BR']);

        Sanctum::actingAs($user);

        $this->withHeaders([
            'Accept-Language' => 'en-US',
            'X-Locale' => 'es',
        ])->getJson('/api/companies');

        $this->assertSame('pt_BR', App::getLocale());
    }

    public function test_user_can_update_locale(): void
    {
        $user = User::factory()->create(['locale' => 'pt_BR']);

        Sanctum::actingAs($user);

        $this->patchJson('/api/user/locale', ['locale' => 'en'])
            ->assertOk()
            ->assertJson(['locale' => 'en']);

        $this->assertSame('en', $user->fresh()->locale);
    }

    public function test_user_locale_rejects_unsupported_value(): void
    {
        $user = User::factory()->create(['locale' => 'pt_BR']);

        Sanctum::actingAs($user);

        $this->patchJson('/api/user/locale', ['locale' => 'fr'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['locale']);
    }

    public function test_magic_link_email_uses_request_locale_for_new_user(): void
    {
        Mail::fake();
        RateLimiter::clear('magic-link:'.sha1('gringo@example.com|127.0.0.1'));

        $this->withHeader('X-Locale', 'en')
            ->postJson('/auth/magic-link', ['email' => 'gringo@example.com'])
            ->assertNoContent();

        Mail::assertSent(MagicLinkMail::class, function (MagicLinkMail $mail) {
            $this->assertSame('en', $mail->locale);

            return $mail->hasTo('gringo@example.com');
        });
    }

    public function test_magic_link_email_uses_saved_user_locale(): void
    {
        Mail::fake();
        User::factory()->create([
            'email' => 'espanhol@example.com',
            'locale' => 'es',
        ]);
        RateLimiter::clear('magic-link:'.sha1('espanhol@example.com|127.0.0.1'));

        $this->withHeader('X-Locale', 'en')
            ->postJson('/auth/magic-link', ['email' => 'espanhol@example.com'])
            ->assertNoContent();

        Mail::assertSent(MagicLinkMail::class, function (MagicLinkMail $mail) {
            $this->assertSame('es', $mail->locale);

            return $mail->hasTo('espanhol@example.com');
        });
    }

    public function test_verify_persists_locale_for_new_user_and_returns_it(): void
    {
        $token = 'locale-token';
        \App\Models\MagicLink::create([
            'email' => 'novo@example.com',
            'token_hash' => \App\Models\MagicLink::hash($token),
            'expires_at' => now()->addMinutes(15),
            'used_at' => null,
            'created_at' => now(),
        ]);

        $response = $this->withHeader('X-Locale', 'es')
            ->getJson('/auth/magic-link/verify?token='.$token.'&email=novo@example.com');

        $response->assertOk()
            ->assertJsonPath('user.locale', 'es');

        $this->assertSame('es', User::where('email', 'novo@example.com')->value('locale'));
    }

    public function test_mail_body_is_translated(): void
    {
        App::setLocale('en');
        $mail = new MagicLinkMail('https://example.com/verify', '123456', 15);
        $html = $mail->render();

        $this->assertStringContainsString('Sign in to your account', $html);
        $this->assertStringContainsString('Access code', $html);
        $this->assertStringNotContainsString('Acesse sua conta', $html);
    }
}
