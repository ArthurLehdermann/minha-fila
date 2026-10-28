<?php

namespace App\Listeners;

use App\Mail\NewUserAdminMail;
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
            Mail::to($adminEmail)->send(new NewUserAdminMail($user));
        } catch (\Exception $e) {
            Log::warning('NotifyAdminOnNewUser: failed to send email', [
                'error' => $e->getMessage(),
                'user' => $user->email ?? null,
            ]);
        }
    }
}
