Minha Fila
---------------

Plataforma SaaS multi-empresa para gestão de filas virtuais em tempo real, focada em operações rápidas como lanchonetes, creperias e food trucks.

Elimina senhas de papel, reduz confusão no atendimento e melhora a percepção de organização do cliente — sem necessidade de hardware adicional.

🌐 **Domínio**
`https://minhafila.meugarcom.app`

---

Principais Funcionalidades
--------------------------
- **Multi-empresa**: Gerencie múltiplos estabelecimentos com uma única conta.
- **Painel Administrativo**: Criação de pedidos e controle de status (Aguardando, Preparando, Pronto, Entregue).
- **Acompanhamento Realtime**: Clientes acompanham o status via PWA (QR Code) com atualizações instantâneas.
- **Autenticação Flexível**: Login via Google OAuth ou Magic Link por e-mail.
- **Infraestrutura Ágil**: Backend Laravel + Frontend Next.js orquestrados via Docker e Traefik.

Links Rápidos
-------------
- [Arquitetura](docs/ARCHITECTURE.md): Visão técnica do SaaS e fluxo de dados.
- [Deploy na Produção](docs/DEPLOY.md): Passo a passo para VPS e padrão de diretórios.
- [Ambiente (.env)](docs/ENVIRONMENT.md): Configuração de variáveis locais e globais.
- [Overview do Produto](docs/OVERVIEW.md): Benefícios e guia de uso.
- [Realtime & Broadcast](docs/REALTIME.md): WebSockets e canais Soketi/Pusher.

Stack Tecnológica
-----------------
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Laravel 11, PostgreSQL, Redis.
- **Comunicação**: WebSockets via Soketi (Pusher-compatible), Laravel Echo.
- **Proxy/Ingress**: Traefik com TLS automático (Let's Encrypt).

---

## 🚀 Proposta do Produto

Organizar filas de pedidos de forma simples, rápida e acessível, com acompanhamento em tempo real pelo cliente via celular.

---

## 🔑 Funcionalidades Principais

### Multi-empresa

* Um usuário pode gerenciar múltiplos estabelecimentos
* Cada empresa possui um identificador único (UUID curto)

### Painel Administrativo

* Criação rápida de pedidos (com ou sem descrição)
* Numeração sequencial automática por empresa
* Controle de status:

  * Aguardando
  * Preparando
  * Pronto
  * Entregue
* Possibilidade de corrigir status (retroceder)
* Reset de numeração (seguro, sem perder histórico)

### Fila Pública (Cliente)

* Acesso via QR Code ou link direto
* Lista de pedidos prontos e em preparação
* Atualização em tempo real
* Interface simples, legível e mobile-first (PWA)

### Realtime

* Atualização instantânea via WebSocket (Soketi)
* Sincronização garantida via `sequence_id`
* Reconexão resiliente

### Autenticação

* Login via **Google OAuth**
* Login via **Magic Link (e-mail)**
* Unificação automática de contas por e-mail
* Sem necessidade de senha

---

## 🧠 Arquitetura

### Frontend

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* PWA
* SWR / React Query
* Laravel Echo (WebSocket client)

### Backend

* Laravel 11
* Postgres 17
* Redis 7 (cache + queue + pub/sub)
* Soketi (WebSocket server compatível com Pusher)

### Infraestrutura

* Docker (multi-container)
* Traefik (reverse proxy + TLS automático)
* Deploy em VPS própria (GitHub Actions)

---

## 🔄 Fluxo Básico

1. Usuário faz login (Google ou Magic Link)
2. Cria sua empresa (primeiro acesso)
3. Acessa painel:
   ```
   https://minhafila.meugarcom.app/{uuid}/admin
   ```
4. Cria pedidos e atualiza status
5. Cliente acompanha em:
   ```
   https://minhafila.meugarcom.app/{uuid}
   ```
6. Atualizações acontecem em tempo real

---

## 🎯 Objetivo do MVP

Ser extremamente simples, rápido e confiável para uso em ambientes com alta demanda e pouco tempo de operação (ex: verão, praia, eventos).

---

## 💡 Diferenciais

* Zero hardware adicional
* Setup em minutos
* Foco total em pequenos negócios
* UX direta e sem fricção
* Realtime leve e confiável
* Funciona em qualquer celular (PWA)

---

# 🛠️ Desenvolvimento Local

Para desenvolvedores e contribuidores:

1. **Configurar Ambiente**:
   ```bash
   cp .env.example .env
   # Edite o .env se necessário
   ```

2. **Subir Containers (Dev)**:
   ```bash
   docker compose -f docker-compose-dev.yml up -d --build
   ```

3. **Setup Inicial**:
   ```bash
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan migrate --seed
   ```
