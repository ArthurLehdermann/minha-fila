# Arquitetura Técnica - SaaS Multi-empresa

O Minha Fila evoluiu de uma aplicação isolada para uma plataforma SaaS multi-inquilino (multi-tenant), operando sob um domínio unificado e centralizado.

Core SaaS Model
---------------
- **Usuários e Empresas**: A relação é de `1 Usuário : N Empresas`. Um único login dá acesso ao painel de gestão de todas as empresas de propriedade do usuário.
- **Tenant Isolation**: O isolamento é lógico (via `company_id` ou `uuid`). O middleware `EnsureTenantAccess` garante que um usuário só manipule pedidos de empresas das quais é proprietário.
- **UUIDs Curtos**: Empresas são identificadas por UUIDs curtos e amigáveis para URLs de clientes (ex: `/fila/fk29ad`).

Infraestrutura e Roteamento (Traefik)
-------------------------------------
A plataforma utiliza roteamento baseado em caminhos (path-based routing) no Traefik para unificar o domínio `minha-fila.meugarcom.app`:

- `/api/*`, `/auth/*`, `/sanctum/*`, `/storage/*` -> Direcionado ao container **Backend (Laravel)**.
- `/*` (Demais rotas) -> Direcionado ao container **Frontend (Next.js)**.
- **TLS Automático**: Gerenciado via Traefik com Let's Encrypt (HTTP-01 Challenge).

Stack Tecnológica
-----------------
- **Frontend (Next.js)**: Utiliza App Router e Server Components. Comunicação com a API via Axios e sincronização em tempo real com Laravel Echo.
- **Backend (Laravel)**: API RESTful, PHP 8.3, PostgreSQL 17.
- **Realtime (Soketi)**: Servidor WebSocket compatível com Pusher, rodando em container separado, permitindo broadcast de eventos do Laravel para o Next.js.
- **Cache & Filas (Redis)**: Utilizado para gerenciar a expiração de Magic Links, cache de aplicações e processamento de filas em segundo plano.

Segurança e Autenticação
------------------------
- **Social Auth**: Google OAuth 2.0 integrado via Socialite.
- **Magic Link**: Autenticação sem senha via e-mail direto, com links de uso único e tempo de expiração curto (15-30 min).
- **Sanctum**: Tokens de API seguros e estados de sessão para o SPA Next.js.

Fluxo de Pedidos e Realtime
---------------------------
Canais de WebSockets seguem o padrão `company.{uuid}`. 
- Quando um pedido é criado ou atualizado no Admin (`/fila/[uuid]/admin`), o Laravel dispara um evento `OrderUpdated` ou `OrderCreated`.
- O Soketi propaga o evento para o canal da empresa.
- O Frontend do cliente (`/fila/[uuid]`) escuta o canal e atualiza a UI instantaneamente sem recarregar a página.

Ordenação Consistente
---------------------
- **Sequence ID**: Cada empresa possui um contador de sequência independente (`order_sequences`) para garantir que os números de pedidos (senhas) sejam incrementais e reiniciáveis diariamente.
- **Isolation**: Garantia de que a Fila A não interfira na numeração da Fila B.
