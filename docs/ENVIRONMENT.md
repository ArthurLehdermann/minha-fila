# Variáveis de Ambiente (.env)

O Minha Fila requer as seguintes variáveis configuradas tanto no ambiente de desenvolvimento local quanto no VPS de produção.

## Configurações Globais
- `APP_NAME`: MinhaFila
- `APP_ENV`: `local` ou `production`
- `APP_KEY`: Gerada com `php artisan key:generate`
- `APP_URL`: `https://minhafila.meugarcom.app` (em produção) ou `http://localhost:8000` (local)
- `NEXT_PUBLIC_API_URL`: Deve coincidir com o `APP_URL` para o Next.js.

## Banco de Dados (PostgreSQL)
- `DB_CONNECTION`: `pgsql`
- `DB_HOST`: `db` (Docker) ou `127.0.0.1` (Local)
- `DB_PORT`: `5432`
- `DB_DATABASE`: `minhafila`
- `DB_USERNAME`: `minhafila`
- `DB_PASSWORD`: (segredo)

## Cache, Sessão e Fila (Redis)
- `CACHE_DRIVER`: `redis`
- `SESSION_DRIVER`: `redis`
- `QUEUE_CONNECTION`: `redis`
- `REDIS_HOST`: `redis`
- `REDIS_PORT`: `6379`

## Autenticação e OAuth
- `GOOGLE_CLIENT_ID`: (obtido no Google Console)
- `GOOGLE_CLIENT_SECRET`: (obtido no Google Console)
- `GOOGLE_REDIRECT_URI`: `${APP_URL}/auth/google/callback`
- `MAGIC_LINK_EXPIRE_MINUTES`: Recomendado 15 a 30.

## WebSockets e Realtime (Soketi/Pusher)
- `BROADCAST_DRIVER`: `pusher`
- `PUSHER_APP_ID`: (id no Soketi)
- `PUSHER_APP_KEY`: (key no Soketi)
- `PUSHER_APP_SECRET`: (secret no Soketi)
- `PUSHER_HOST`: `minhafila.meugarcom.app` (em produção através do Traefik)
- `PUSHER_PORT`: `443`
- `PUSHER_SCHEME`: `https`
- `NEXT_PUBLIC_PUSHER_APP_KEY`: (mesma key acima)
- `NEXT_PUBLIC_PUSHER_HOST`: `minhafila.meugarcom.app`
- `NEXT_PUBLIC_PUSHER_PORT`: `443`
- `NEXT_PUBLIC_PUSHER_SCHEME`: `https`
- `NEXT_PUBLIC_PUSHER_CLUSTER`: `mt1`

## E-mail (SMTP)
- `MAIL_MAILER`: `smtp`
- `MAIL_HOST`: (ex: `mail.meugarcom.app`)
- `MAIL_PORT`: `465`
- `MAIL_USERNAME`: (usuário SMTP)
- `MAIL_PASSWORD`: (senha SMTP)
- `MAIL_ENCRYPTION`: `ssl`

---

> [!CAUTION]
> **Segurança**: Em produção, certifique-se de que o `.env.prod` esteja localizado fora da raiz pública do servidor, preferencialmente em `/root/minha-fila-secrets/.env.prod`. Ele é montado nos containers via Docker Compose.
