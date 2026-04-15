<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotifyAdminOnNewUser
{
    public function handle(Registered $event): void
    {
        $adminEmail = (string) config('app.admin_email', '');
        if ($adminEmail === '') {
            return;
        }

        $user = $event->user;

        try {
            Mail::raw(
                implode("\n", [
                    'Novo usuário registrado no Minha Fila!',
                    '',
                    'Nome:  ' . ($user->name ?? '—'),
                    'Email: ' . ($user->email ?? '—'),
                    'Data:  ' . now('America/Sao_Paulo')->format('d/m/Y H:i'),
                    '',
                    (string) config('app.frontend_url', config('app.url')),
                ]),
                function ($message) use ($adminEmail, $user) {
                    $message
                        ->to($adminEmail)
                        ->subject('[Minha Fila] Novo usuário: ' . ($user->name ?? $user->email));
                }
            );
        } catch (\Exception $e) {
            Log::warning('NotifyAdminOnNewUser: failed to send email', [
                'error' => $e->getMessage(),
                'user'  => $user->email ?? null,
            ]);
        }
    }
}
