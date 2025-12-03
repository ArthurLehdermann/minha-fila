# Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto. Exemplos mínimos (ajuste conforme necessário):

Aplicação
APP_NAME=MinhaFila
APP_ENV=production
APP_KEY= # gerar com: php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://minhafila.vps.bigworks.com.br

Locale/Logs
APP_LOCALE=pt_BR
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=pt_BR
LOG_CHANNEL=stack
LOG_LEVEL=debug

Banco (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=minhafila
DB_USERNAME=minhafila
DB_PASSWORD=minhafila

Sessão/Cache/Fila
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
CACHE_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

Redis
REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

E‑mail (exemplo)
MAIL_MAILER=smtp
MAIL_ENCRYPTION=ssl
MAIL_HOST=mail.bigworks.com.br
MAIL_PORT=465
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=""
MAIL_FROM_NAME="${APP_NAME}"

OAuth (Google)
# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=${APP_URL}/auth/google/callback

Magic Link
# Expiração do link (minutos)
MAGIC_LINK_EXPIRE_MINUTES=15

Broadcast (Soketi/Pusher‑compatible)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=2086410
PUSHER_APP_KEY=c31d1eb67de93c50e8ea
PUSHER_APP_SECRET=f7c319d8d0457ad709d2
PUSHER_APP_CLUSTER=sa1
PUSHER_HOST=soketi.minhafila.vps.bigworks.com.br
PUSHER_PORT=443
PUSHER_SCHEME=https

Observações
- Não versione `.env`. Considere manter um `.env.example` sem segredos.
- Atualize domínios/credenciais para produção.


