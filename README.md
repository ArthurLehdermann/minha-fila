Minha Fila
==========

Sistema de fila virtual em tempo real para lanchonetes e operações fast‑food pequenas. O cliente acompanha sua senha e status via PWA (QR code), enquanto o estabelecimento organiza e atualiza os pedidos em painéis simples. Realtime via Soketi (Pusher‑compatible).

Links rápidos
-------------
- Documentação do produto: `docs/OVERVIEW.md`
- Arquitetura: `docs/ARCHITECTURE.md`
- API (MVP): `docs/API.md`
- Realtime (canais, eventos, payloads): `docs/REALTIME.md`
- Docker/Infra: `docs/DOCKER.md`
- Variáveis de ambiente: `docs/ENVIRONMENT.md`
- Backend (Laravel): `docs/BACKEND.md`
- Frontend (Next.js): `docs/FRONTEND.md`
- Deploy (VPS + Vercel): `docs/DEPLOY.md`
- Roadmap/Sprint 1: `docs/ROADMAP.md`

Stack
-----
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, PWA, SWR/React Query, Echo
- Backend: Laravel 10/11 (PHP‑FPM), PostgreSQL 15, Redis 7, Soketi, Traefik/Compose
- Comunicação: REST + WebSockets (broadcast Laravel → Soketi → Echo)

Começando rápido (backend com Docker)
-------------------------------------
Pré‑requisitos: Docker, Docker Compose e rede Traefik externa.

1) Criar a rede do Traefik (se ainda não existir)
   docker network create traefik

2) Configurar variáveis de ambiente
   Ver `docs/ENVIRONMENT.md` e crie um `.env` na raiz.

3) Subir os serviços
   docker compose up -d --build

4) Gerar APP_KEY (dentro do container PHP)
   docker compose exec app php artisan key:generate

5) Rodar migrações/seeders (quando o código Laravel estiver presente)
   docker compose exec app php artisan migrate --seed

Estruturas previstas
--------------------
- Backend (Laravel): `app/`, `routes/api.php`, `app/Events/OrderUpdated.php`, `app/Http/Controllers/OrderController.php`, etc.
- Frontend (Next.js): `src/app/`, `src/components/`, `src/lib/echo.ts`, `src/hooks/`.
Veja detalhes em `docs/BACKEND.md` e `docs/FRONTEND.md`.

Licença
-------
Definir.
minha-fila
==========

Reinício do projeto do zero na branch `xmp`.

Próximos passos:
- Definir stack/tecnologias a serem usadas
- Inicializar estrutura básica do projeto


