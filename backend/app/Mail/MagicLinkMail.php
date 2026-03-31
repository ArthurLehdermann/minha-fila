<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MagicLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $link,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Seu link de acesso — Minha Fila');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.magic-link');
    }
}
