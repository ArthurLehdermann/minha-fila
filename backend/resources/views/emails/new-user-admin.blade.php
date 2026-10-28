@extends('emails.layout', [
    'footerReason' => 'Você recebeu este e-mail porque está configurado como administrador do Minha Fila.',
    'title' => 'Novo usuário',
])

@section('content')
        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Novo usuário registrado</h1>
        <p style="margin:0 0 24px;font-size:14px;color:#475569;">
            Um novo cadastro acabou de entrar no Minha Fila.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;font-size:14px;color:#0f172a;">
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;width:96px;vertical-align:top;">Nome</td>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">{{ $name }}</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;vertical-align:top;">E-mail</td>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">{{ $email }}</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;vertical-align:top;">Idioma</td>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">{{ $locale }}</td>
            </tr>
            <tr>
                <td style="padding:8px 0;color:#64748b;vertical-align:top;">Data</td>
                <td style="padding:8px 0;font-weight:600;">{{ $registeredAt }}</td>
            </tr>
        </table>

        <a href="{{ $panelUrl }}"
           style="display:block;text-align:center;padding:12px 24px;background:#2563eb;color:#ffffff;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
            Abrir painel
        </a>
@endsection
