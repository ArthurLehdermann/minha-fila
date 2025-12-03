# Docker e Infra

Serviços (Compose)
- app: Laravel (PHP‑FPM) — build via `docker/php/Dockerfile`
- queue: worker de filas — `docker/php/Dockerfile.cli`
- scheduler: cron/schedule — `docker/php/Dockerfile.cli`
- node: build de assets/frontend
- db: PostgreSQL 15
- redis: Redis 7
- soketi: servidor WebSocket Pusher‑compatible
- rede externa: `traefik`
- volumes: `pgdata`, `redisdata`

Pré‑requisitos
- Docker e Docker Compose instalados
- Rede Traefik (externa) criada:
  docker network create traefik

Comandos úteis
- Subir serviços: `docker compose up -d --build`
- Ver logs: `docker compose logs -f --tail=200 app` (ou outro serviço)
- Exec dentro do app: `docker compose exec app sh`
- Gerar `APP_KEY`: `docker compose exec app php artisan key:generate`
- Migrações: `docker compose exec app php artisan migrate --seed`

Traefik
- As rotas estão etiquetadas via labels (Host rules + TLS)
- Certificados gerenciados via ACME/Let’s Encrypt (resolver `letsencrypt`)

Observações
- Garanta que os Dockerfiles existam em `docker/php/`
- Ajuste o domínio nas labels do Traefik conforme seu ambiente


