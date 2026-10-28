# Docker e Infra

Dois compose: `compose.yml` (produção) e `compose.dev.yml` (local, com Postgres embutido e porta publicada).

## Serviços (produção)

- `minha_fila_app`: Laravel — build do `Dockerfile` do repo (`FROM arthurlehdermann/alpine-nginx-php8.3:8.3.36`), tag local `minha-fila:app`.
- `minha_fila_queue` / `minha_fila_scheduler`: mesma imagem `minha-fila:app` (comando artisan). Também entram na rede `traefik` para alcançar o Postgres externo.
- `minha_fila_frontend`: Next.js 16 em Node 22 (build em `docker/frontend/Dockerfile`, porta 3000).
- `minha_fila_redis`: Redis 7 (`redis:7-alpine`).
- `minha_fila_soketi`: WebSocket compatível com Pusher (`bigworks/soketi:1.6.1-node22`, porta 6001, rota `/app`).
- `minha_fila_maintenance`: `nginx:alpine`, sobe só durante o cutover do deploy.
- Redes: `traefik` (externa, proxy) e `minhafila_internal` (banco/cache/serviços internos).

O PostgreSQL de produção não está definido neste compose: o backend aponta para um container `db` na rede `minhafila_internal` (`DB_HOST=db`), provisionado fora do stack de app. No compose dev, o serviço `db` usa `postgres:17` com volume `pgdata_dev` e porta publicada em `5432`.

## Roteamento (Traefik, por labels)

- Host canônico `minha-fila.meugarcom.app` (sempre com traço). O antigo `minhafila.meugarcom.app` redireciona para ele (exceto o webhook do Mercado Pago, servido direto no host legado até o painel do MP apontar para o canônico).
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
docker compose -f compose.dev.yml up -d --build
```

O dev publica o Postgres em `5432`, usa credenciais padrão `minhafila` e pode usar a imagem pública do Soketi; em produção a imagem é a pinada Node 22 acima.
