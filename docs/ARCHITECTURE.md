# Arquitetura Técnica - SaaS Multi-empresa

O Minha Fila é um monólito Laravel (API) com frontend Next.js separado, realtime por Soketi e Redis para cache/fila. Roda em containers sob um domínio unificado.

## Modelo SaaS

- **Usuários e empresas**: relação `1 usuário : N empresas`. Um login administra todas as empresas do dono.
- **Isolamento de tenant**: lógico, por `company_id`/UUID. O middleware `EnsureTenantAccess` garante que o usuário só manipule pedidos das empresas dele. Rotas de escrita exigem `auth:sanctum` + `tenant.access` + `plan.access`.
- **IDs curtos**: empresas têm um id público curto e determinístico gerado com Sqids a partir de `id_int` (`Company::generateShortId`), usado nas URLs do cliente. Requer a extensão `bcmath` ou `gmp` no PHP (presente na imagem de produção).

## Roteamento (Traefik)

Roteamento por caminho no host `minhafila.meugarcom.app` (o legado `minha-fila.meugarcom.app` redireciona):

- `/api/*`, `/auth/google/*`, `/auth/magic-link/*`, `/sanctum/*`, `/storage/*` -> container **backend** (Laravel).
- `/app/*` -> container **Soketi** (WebSocket).
- demais caminhos -> container **frontend** (Next.js).
- TLS automático via Let's Encrypt (resolver `letsencrypt`).

## Stack

- **Frontend (Next.js 16)**: App Router. Fala com a API por Axios (`swr` para revalidação) e escuta realtime com `laravel-echo` + `pusher-js`.
- **Backend (Laravel 12, PHP 8.3)**: API REST, PostgreSQL 17.
- **Realtime (Soketi)**: servidor WebSocket compatível com Pusher, em container próprio, recebe o broadcast do Laravel e entrega ao Next.
- **Cache e fila (Redis 7)**: expiração de Magic Link, cache e filas (worker `minha_fila_queue`, agendador `minha_fila_scheduler`).
- **Pagamento (Mercado Pago)**: assinatura no cartão (preapproval) e Pix por ciclo. Ver [BILLING](BILLING.md).
- **Erros (Sentry)**: `sentry/sentry-laravel` no backend.

## Autenticação

- **Google OAuth 2.0** via Socialite. É o único provider social implementado hoje (não há Apple).
- **Magic Link** por e-mail: link de uso único, com hash de código e expiração curta (`MAGIC_LINK_EXPIRE_MINUTES`).
- **Sanctum**: tokens de API para o frontend.
- Unificação por e-mail: `user_providers` mapeia `user_id -> {provider, provider_id}` sem duplicar usuário.

## Pedidos e realtime

- Canal por empresa: `company.{uuid}`.
- Ao criar (`OrderController::store`) ou atualizar (`update`) um pedido, o backend dispara o evento `OrderUpdated`, que o Soketi propaga no canal da empresa.
- O cliente escuta `.OrderUpdated` e revalida a lista. Hoje o frontend só escuta esse evento; não há evento `OrderCreated` dedicado (ver pendência #4 no [TECH_AUDIT](TECH_AUDIT_2026-04-03.md)).

## Ordenação consistente

- **Sequência por empresa**: `order_sequences` guarda o contador de cada empresa. `OrderSequence::nextFor` roda em `DB::transaction` com `lockForUpdate`, atômico sob concorrência.
- **Reset**: a numeração pode ser reiniciada por empresa (`reset-sequence`), sem afetar as demais.
