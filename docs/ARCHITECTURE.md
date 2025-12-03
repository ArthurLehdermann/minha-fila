# Arquitetura

Frontend (Vercel)
- Next.js 14 (App Router), TypeScript, Tailwind, PWA
- SWR/React Query para cache/sincronização
- Echo (Pusher client) para WebSockets (via Soketi)

Backend (VPS + Traefik)
- Laravel 10/11 (PHP‑FPM)
- PostgreSQL 15 (dados)
- Redis 7 (cache, filas, pub/sub)
- Soketi (Pusher‑compatible WebSocket)
- Orquestração com Docker Compose e reverse proxy com Traefik (TLS ACME)

Autenticação e Identidade
- Login com Google (OAuth) e Magic Link (e‑mail).
- Regra de unificação: se o e‑mail coincidir, sempre referenciar o mesmo `user`.
- Tabela relacional `user_providers (user_id, provider, provider_id, created_at)` para rastrear logins (ex.: `provider=google` com `provider_id`, para Magic Link pode registrar `provider=magic`).

Comunicação
- REST para CRUD e relatórios
- WebSockets para atualização em tempo real (eventos broadcast do Laravel)
- Autenticação: token (Sanctum ou Bearer) conforme rotas privadas

Pontos de atenção
- Reconnect resiliente: cliente revalida estado via SWR se perder eventos
- `sequence_id` para assegurar ordenação/consistência
- Canais por empresa: `company.<uuid>`

Fluxo de primeiro acesso
1) Usuário loga pela primeira vez (Google/Apple).
2) Se não tiver empresa, criar e atribuir empresa com UUID curto (ex.: `fk29ad`).
3) Redirecionar para `/[uuid]/admin`.


