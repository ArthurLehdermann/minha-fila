<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewUserAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[Minha Fila] Novo usuário: '.($this->user->name ?? $this->user->email),
        );
    }

    public function content(): Content
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', config('app.url')), '/');

        return new Content(
            view: 'emails.new-user-admin',
            text: 'emails.new-user-admin-text',
            with: [
                'name' => $this->user->name ?: '—',
                'email' => $this->user->email ?: '—',
                'locale' => $this->user->locale ?: 'pt_BR',
                'registeredAt' => now('America/Sao_Paulo')->format('d/m/Y H:i'),
                'panelUrl' => $frontendUrl,
            ],
        );
    }
}
