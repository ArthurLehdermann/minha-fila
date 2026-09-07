# Variáveis de Ambiente (.env)

Chaves reais em `backend/.env.example`. Em produção, o arquivo vive em `/root/minha-fila-secrets/.env.prod` e nunca dentro de `minha-fila/`.

## App

- `APP_NAME` (MinhaFila), `APP_ENV` (`local`/`production`), `APP_KEY`, `APP_DEBUG`, `APP_URL`.
- `APP_LOCALE`, `APP_FALLBACK_LOCALE`, `APP_FAKER_LOCALE`.
- `FRONTEND_URL` e `NEXT_PUBLIC_API_URL` (o front aponta para a mesma origem em produção).
- `ADMIN_EMAIL`.

## Banco (PostgreSQL 17)

- `DB_CONNECTION=pgsql`, `DB_HOST` (`db` no compose dev), `DB_PORT=5432`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.

## Cache, sessão e fila (Redis 7)

- `CACHE_STORE`, `SESSION_DRIVER`, `SESSION_LIFETIME`, `QUEUE_CONNECTION`.
- `REDIS_CLIENT`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.

## Autenticação

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (`${APP_URL}/auth/google/callback`).
- `MAGIC_LINK_EXPIRE_MINUTES` (15 a 30).

Não há variáveis de Apple: o provider não está implementado.

## Realtime (Soketi/Pusher)

- Backend: `BROADCAST_CONNECTION=pusher`, `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, `PUSHER_HOST`, `PUSHER_PORT`, `PUSHER_SCHEME`, `PUSHER_APP_CLUSTER`.
- Frontend: `NEXT_PUBLIC_PUSHER_APP_KEY`, `NEXT_PUBLIC_PUSHER_HOST`, `NEXT_PUBLIC_PUSHER_PORT`, `NEXT_PUBLIC_PUSHER_SCHEME`, `NEXT_PUBLIC_PUSHER_CLUSTER`.

Em produção o Soketi é exposto pelo Traefik em `/app` no host `minhafila.meugarcom.app`, porta 443.

## E-mail

- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`.

## Mercado Pago

`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `MP_WEBHOOK_SECRET`, `MP_PLAN_ID_MENSAL`, `MP_PLAN_ID_ANUAL`, `MP_PRECO_MENSAL`, `MP_PRECO_ANUAL`, `MP_PIX_EXPIRACAO_MINUTOS`, `MP_CARENCIA_DIAS`, `MP_CURRENCY` (BRL), `MP_SITE_ID` (MLB). Ver [BILLING](BILLING.md).

## Observabilidade

- `SENTRY_LARAVEL_DSN`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE`, `SENTRY_SEND_DEFAULT_PII`.
- `LOG_CHANNEL`, `LOG_LEVEL`.
