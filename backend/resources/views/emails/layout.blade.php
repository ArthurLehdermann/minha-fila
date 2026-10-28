@php
    $frontendUrl = rtrim((string) config('app.frontend_url', config('app.url')), '/');
    $logoUrl = $frontendUrl.'/logo.png';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? config('app.name', 'Minha Fila') }}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;line-height:1.6;-webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td align="center" style="padding:28px 32px 8px;">
                            <a href="{{ $frontendUrl }}" style="text-decoration:none;">
                                <img src="{{ $logoUrl }}" alt="Minha Fila" width="160" style="display:block;width:160px;max-width:70%;height:auto;border:0;">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 32px 32px;">
                            @yield('content')
                        </td>
                    </tr>
                </table>
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
                    <tr>
                        <td align="center" style="padding:20px 16px 8px;font-size:12px;color:#94a3b8;line-height:1.5;">
                            <a href="{{ $frontendUrl }}" style="color:#2563eb;text-decoration:none;font-weight:600;">{{ $frontendUrl }}</a>
                            @if (! empty($footerReason))
                                <br>
                                <span style="color:#94a3b8;">{{ $footerReason }}</span>
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
