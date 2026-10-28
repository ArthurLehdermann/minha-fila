# E-mails

Todos os e-mails transacionais do Minha Fila usam o **mesmo layout HTML** com a marca (logo, cartão central e rodapé).

## Layout

- View: `backend/resources/views/emails/layout.blade.php`
- Logo: URL absoluta `{FRONTEND_URL}/logo.png` (`config('app.frontend_url')` + `/logo.png`)
- Cartão central (~560px), cores da identidade (`#2563eb` + neutros slate)
- Estilo inline (Gmail, Outlook, iOS Mail)
- Rodapé: link do site + motivo do envio (`$footerReason`)

Views filhas usam `@extends('emails.layout', ['footerReason' => ...])` e preenchem `@section('content')`.

## E-mails atuais

| Mailable | View HTML | Texto puro | Idioma |
|---|---|---|---|
| `App\Mail\MagicLinkMail` | `emails.magic-link` | — | pt_BR / en / es via `__('mail.magic_link.*')` |
| `App\Mail\NewUserAdminMail` | `emails.new-user-admin` | `emails.new-user-admin-text` | pt-BR (só admin) |

O aviso de novo usuário é disparado por `App\Listeners\NotifyAdminOnNewUser` no evento `Registered`, se `ADMIN_EMAIL` estiver configurado. Falha de envio é logada e **não** quebra o cadastro.

## Como criar um e-mail novo

1. Criar o Mailable em `backend/app/Mail/` (ex.: `BillingInvoiceMail`).
2. Criar a view Blade em `backend/resources/views/emails/` estendendo `emails.layout`.
3. Preferir também uma view `text:` para clientes sem HTML.
4. Strings do usuário final: chaves em `backend/lang/{pt_BR,en,es}/mail.php` e `Mail::to(...)->locale($locale)`.
5. E-mails internos só para admin podem ficar fixos em pt-BR.

Cobrança e outros avisos futuros (ex. issue de billing) devem reutilizar este layout — não inventar HTML paralelo.

## Traduções

- Magic Link e demais e-mails ao usuário: `backend/lang/{locale}/mail.php` (`mail.*`).
- Locale do envio: `Mail::to(...)->locale($locale)` (conta existente → `users.locale`; primeiro acesso → locale do pedido). Detalhe em [I18N.md](I18N.md).
