<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Minha Fila — Atualizando sistema</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Figtree', sans-serif;
            background: #0c0e1a;
            color: #e2e8f0;
            height: 100dvh;
            overflow: hidden;
            display: flex;
        }

        .skeleton-sidebar {
            width: 240px;
            min-width: 240px;
            height: 100dvh;
            background: #111320;
            border-right: 1px solid #1e2235;
            padding: 20px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            filter: blur(3px);
            pointer-events: none;
            user-select: none;
        }

        .skeleton-sidebar-header {
            height: 32px;
            background: #1e2235;
            border-radius: 8px;
            width: 80%;
            margin-bottom: 8px;
        }

        .skeleton-nav-item {
            height: 36px;
            background: #1a1d2e;
            border-radius: 8px;
        }

        .skeleton-nav-item.active {
            background: #2d2060;
        }

        .skeleton-nav-item.short { width: 60%; }

        .skeleton-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100dvh;
            filter: blur(3px);
            pointer-events: none;
            user-select: none;
        }

        .skeleton-topbar {
            height: 52px;
            background: #111320;
            border-bottom: 1px solid #1e2235;
            display: flex;
            align-items: center;
            padding: 0 24px;
            gap: 12px;
        }

        .skeleton-topbar-pill {
            height: 28px;
            width: 120px;
            background: #1e2235;
            border-radius: 20px;
        }

        .skeleton-topbar-pill.wide { width: 200px; }

        .skeleton-chat {
            flex: 1;
            padding: 28px 40px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow: hidden;
        }

        .skeleton-bubble {
            height: 52px;
            background: #1a1d2e;
            border-radius: 16px;
        }

        .skeleton-bubble.user {
            width: 55%;
            align-self: flex-end;
            background: #2d2060;
            border-radius: 16px 16px 4px 16px;
        }

        .skeleton-bubble.assistant {
            width: 80%;
            align-self: flex-start;
        }

        .skeleton-bubble.assistant.tall {
            height: 96px;
            width: 72%;
        }

        .skeleton-chart {
            width: 68%;
            height: 140px;
            background: #151828;
            border-radius: 12px;
            border: 1px solid #1e2235;
        }

        .skeleton-input {
            padding: 16px 24px;
            border-top: 1px solid #1e2235;
        }

        .skeleton-input-bar {
            height: 48px;
            background: #1a1d2e;
            border-radius: 24px;
            border: 1px solid #1e2235;
        }

        .overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            z-index: 10;
        }

        .card {
            background: rgba(17, 19, 32, 0.92);
            border: 1px solid rgba(109, 89, 216, 0.35);
            border-radius: 20px;
            padding: 40px 48px;
            text-align: center;
            max-width: 420px;
            width: 100%;
            box-shadow:
                0 0 0 1px rgba(109, 89, 216, 0.1),
                0 32px 64px rgba(0, 0, 0, 0.6),
                0 0 80px rgba(109, 89, 216, 0.06);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }

        .logo {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 28px;
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
        }

        .logo-text {
            font-size: 20px;
            font-weight: 600;
            color: #f1f5f9;
            letter-spacing: -0.3px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(109, 89, 216, 0.2);
            border-top-color: #7c3aed;
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
            margin: 0 auto 24px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .title {
            font-size: 18px;
            font-weight: 600;
            color: #f1f5f9;
            margin-bottom: 10px;
            letter-spacing: -0.2px;
        }

        .subtitle {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
        }

        .dots {
            display: inline-block;
            width: 20px;
            text-align: left;
        }

        .progress-bar {
            margin-top: 28px;
            height: 3px;
            background: rgba(109, 89, 216, 0.15);
            border-radius: 99px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #6366f1);
            border-radius: 99px;
            animation: progress 2.4s ease-in-out infinite;
        }

        @keyframes progress {
            0%   { width: 0%; margin-left: 0; }
            50%  { width: 70%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
        }

        @media (max-width: 640px) {
            .skeleton-sidebar { display: none; }

            .card {
                padding: 32px 24px;
            }

            .skeleton-chat {
                padding: 20px 16px;
            }
        }
    </style>
</head>
<body>
    <div class="skeleton-sidebar" aria-hidden="true">
        <div class="skeleton-sidebar-header"></div>
        <div class="skeleton-nav-item active"></div>
        <div class="skeleton-nav-item"></div>
        <div class="skeleton-nav-item short"></div>
        <div class="skeleton-nav-item"></div>
        <div class="skeleton-nav-item short"></div>
        <div class="skeleton-nav-item"></div>
    </div>

    <div class="skeleton-main" aria-hidden="true">
        <div class="skeleton-topbar">
            <div class="skeleton-topbar-pill wide"></div>
            <div class="skeleton-topbar-pill"></div>
        </div>
        <div class="skeleton-chat">
            <div class="skeleton-bubble user"></div>
            <div class="skeleton-bubble assistant tall"></div>
            <div class="skeleton-chart"></div>
            <div class="skeleton-bubble user" style="width:40%"></div>
            <div class="skeleton-bubble assistant"></div>
        </div>
        <div class="skeleton-input">
            <div class="skeleton-input-bar"></div>
        </div>
    </div>

    <div class="overlay" role="status" aria-live="polite">
        <div class="card">
            <div class="logo">
                <div class="logo-icon">✦</div>
                <span class="logo-text">Minha Fila</span>
            </div>

            <div class="spinner" aria-hidden="true"></div>

            <p class="title">Atualizando o sistema</p>
            <p class="subtitle">
                Estamos aplicando melhorias.<br>
                Volte em alguns instantes<span class="dots" id="dots"></span>
            </p>

            <div class="progress-bar" aria-hidden="true">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>

    <script>
        const el = document.getElementById('dots');
        let n = 0;
        setInterval(() => { el.textContent = '.'.repeat((n++ % 3) + 1); }, 500);

        setTimeout(() => location.reload(), 60000);
    </script>
</body>
</html>
