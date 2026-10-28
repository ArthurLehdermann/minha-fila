<?php

namespace Tests\Feature\Mail;

use App\Listeners\NotifyAdminOnNewUser;
use App\Mail\NewUserAdminMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NewUserAdminMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_mailable_renders_name_and_email(): void
    {
        Config::set('app.frontend_url', 'https://minha-fila.test');

        $user = User::factory()->make([
            'name' => 'Jarbas BigWorks',
            'email' => 'jarbas@bigworks.com.br',
            'locale' => 'pt_BR',
        ]);

        $html = (new NewUserAdminMail($user))->render();

        $this->assertStringContainsString('Jarbas BigWorks', $html);
        $this->assertStringContainsString('jarbas@bigworks.com.br', $html);
        $this->assertStringContainsString('pt_BR', $html);
        $this->assertStringContainsString('https://minha-fila.test/logo.png', $html);
        $this->assertStringContainsString('Abrir painel', $html);
    }

    public function test_listener_is_silent_when_admin_email_is_empty(): void
    {
        Mail::fake();
        Config::set('app.admin_email', '');

        $user = User::factory()->create([
            'email' => 'novo@example.com',
        ]);

        (new NotifyAdminOnNewUser)->handle(new Registered($user));

        Mail::assertNothingSent();
    }

    public function test_listener_does_not_break_when_send_fails(): void
    {
        Config::set('app.admin_email', 'admin@example.com');

        Mail::shouldReceive('to')
            ->once()
            ->andThrow(new \RuntimeException('SMTP down'));

        $user = User::factory()->create([
            'email' => 'falha@example.com',
        ]);

        (new NotifyAdminOnNewUser)->handle(new Registered($user));

        $this->assertDatabaseHas('users', ['email' => 'falha@example.com']);
    }

    public function test_listener_sends_new_user_admin_mail(): void
    {
        Mail::fake();
        Config::set('app.admin_email', 'admin@example.com');

        $user = User::factory()->create([
            'name' => 'Ana',
            'email' => 'ana@example.com',
        ]);

        (new NotifyAdminOnNewUser)->handle(new Registered($user));

        Mail::assertSent(NewUserAdminMail::class, function (NewUserAdminMail $mail) {
            return $mail->hasTo('admin@example.com')
                && $mail->user->email === 'ana@example.com';
        });
    }
}
