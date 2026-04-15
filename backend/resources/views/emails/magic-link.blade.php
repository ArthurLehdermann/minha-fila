<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; max-width: 480px; margin: 40px auto; padding: 24px;">
    <h2>Acesse o Minha Fila</h2>
    <p>Clique no botão abaixo para entrar. O link expira em 15 minutos.</p>
    <a href="{{ $link }}"
       style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
        Entrar agora
    </a>
    <p style="margin-top:24px;font-size:12px;color:#6b7280;">
        Se o botão não funcionar, copie e cole este link no navegador:
    </p>
    <p style="font-size:12px;color:#2563eb;word-break:break-all;">
        <a href="{{ $link }}" style="color:#2563eb;">{{ $link }}</a>
    </p>
    <p style="margin-top:24px;font-size:12px;color:#6b7280;">
        Se você não solicitou este e-mail, ignore-o.
    </p>
</body>
</html>
