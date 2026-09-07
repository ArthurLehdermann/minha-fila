# Docker e Infra

Dois compose: `docker-compose.yml` (produção) e `docker-compose-dev.yml` (local, com Postgres embutido e porta publicada).

## Serviços (produção)

- `minha_fila_app`: Laravel (imagem `arthurlehdermann/alpine-nginx-php8.3`).
- `minha_fila_queue`: worker de filas.
- `minha_fila_scheduler`: agendador (`schedule:run`).
- `minha_fila_frontend`: Next.js (build em `docker/frontend/Dockerfile`, porta 3000).
- `minha_fila_redis`: Redis 7 (`redis:7-alpine`).
- `minha_fila_soketi`: WebSocket compatível com Pusher (`quay.io/soketi/soketi`, porta 6001, rota `/app`).
- `minha_fila_maintenance`: `nginx:alpine`, sobe só durante o cutover do deploy.
- Redes: `traefik` (externa, proxy) e `minhafila_internal` (externa, banco/cache/serviços internos).

O PostgreSQL de produção não está definido neste compose: o backend aponta para um container `db` na rede `minhafila_internal` (`DB_HOST=db`), provisionado fora do stack de app. No compose dev, o serviço `db` usa `postgres:17` com volume `pgdata_dev` e porta publicada em `5432`.

## Roteamento (Traefik, por labels)

- Host `minhafila.meugarcom.app` (e legado `minha-fila.meugarcom.app`, que redireciona).
- `/app` -> Soketi (prioridade 350). Backend responde `/api`, `/auth/google`, `/auth/magic-link`, `/sanctum`, `/storage`. O resto vai ao frontend.
- TLS via ACME/Let's Encrypt (resolver `letsencrypt`).

## Comandos úteis

```sh
docker compose up -d --build
docker compose logs -f --tail=200 minha_fila_app
docker compose exec minha_fila_app php artisan migrate --force
docker compose exec minha_fila_app php artisan optimize:clear
```

## Local (dev)

```sh
docker network create traefik   # uma vez, se ainda não existir
docker compose -f docker-compose-dev.yml up -d --build
```

O dev publica o Postgres em `5432` e usa credenciais padrão `minhafila`.
