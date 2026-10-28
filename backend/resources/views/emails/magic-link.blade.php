@extends('emails.layout', [
    'footerReason' => __('mail.layout.reason_magic_link'),
])

@section('content')
        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">{{ __('mail.magic_link.heading') }}</h1>
        <p style="margin:0 0 24px;font-size:14px;color:#475569;">
            {{ __('mail.magic_link.intro', ['minutes' => $expiresMinutes]) }}
        </p>

        <div style="margin:0 0 24px;padding:20px;background:#eff6ff;border:2px dashed #2563eb;border-radius:12px;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;">
                {{ __('mail.magic_link.code_label') }}
            </p>
            <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:0.2em;color:#1e3a8a;font-family:ui-monospace,monospace;">
                {{ $code }}
            </p>
            <p style="margin:10px 0 0;font-size:12px;color:#64748b;">
                {{ __('mail.magic_link.valid_for', ['minutes' => $expiresMinutes]) }}
            </p>
        </div>

        <p style="margin:0 0 12px;font-size:13px;color:#475569;">
            {{ __('mail.magic_link.or_button') }}
        </p>
        <a href="{{ $link }}"
           style="display:block;text-align:center;padding:12px 24px;background:#2563eb;color:#ffffff;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
            {{ __('mail.magic_link.cta') }}
        </a>

        <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
            {{ __('mail.magic_link.ignore') }}
        </p>
@endsection
