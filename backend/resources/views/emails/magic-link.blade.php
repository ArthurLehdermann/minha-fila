<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; margin: 0; padding: 24px; background: #f8fafc;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em;">
            Minha Fila
        </p>
        <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700;">Acesse sua conta</h1>
        <p style="margin: 0 0 24px; font-size: 14px; color: #475569;">
            Use o código abaixo para entrar. Ele expira em {{ $expiresMinutes }} minutos.
        </p>

        <div style="margin: 0 0 24px; padding: 20px; background: #eff6ff; border: 2px dashed #2563eb; border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.08em;">
                Código de acesso
            </p>
            <p style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 0.2em; color: #1e3a8a; font-family: ui-monospace, monospace;">
                {{ $code }}
            </p>
            <p style="margin: 10px 0 0; font-size: 12px; color: #64748b;">
                Válido por {{ $expiresMinutes }} minutos · uso único
            </p>
        </div>

        <p style="margin: 0 0 12px; font-size: 13px; color: #475569;">
            Ou, se preferir, entre direto pelo botão abaixo:
        </p>
        <a href="{{ $link }}"
           style="display: block; text-align: center; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Entrar agora
        </a>

        <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8;">
            Se você não solicitou este e-mail, pode ignorá-lo com segurança.
        </p>
    </div>
</body>
</html>
