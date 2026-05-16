# Minha Fila

Plataforma SaaS multi-empresa para gestão de filas virtuais em tempo real. Elimina senhas de papel, reduz confusão no atendimento e permite que o público acompanhe sua posição via celular (PWA + QR Code), sem hardware adicional.

**Produção:** `https://minha-fila.meugarcom.app`

---

## Funcionalidades

- **Multi-empresa** — um usuário gerencia múltiplos estabelecimentos com um único login.
- **Painel administrativo** — cria senhas, controla status (Aguardando → Preparando → Pronto → Entregue) e reseta numeração com segurança.
- **Fila pública (cliente)** — acesso via QR Code ou link direto; atualizações em tempo real sem refresh.
- **Autenticação sem senha** — Google OAuth e Magic Link por e-mail.
- **WebSockets em tempo real** — sincronização via Soketi (compatível com Pusher) + Laravel Echo.
- **Planos e cobrança** — integração com Stripe via Laravel Cashier (mensal/anual).

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Backend | PHP | ^8.2 (8.3 em prod) |
| Backend | Laravel | ^12.0 |
| Backend | Laravel Sanctum | ^4.3 |
| Backend | Laravel Cashier (Stripe) | ^16.5 |
| Backend | Laravel Socialite | ^5.26 |
| Backend | Predis | ^3.3 |
| Backend | Soketi (WebSocket server) | latest |
| Backend | endroid/qr-code | ^5.0 |
| Backend | sqids/sqids | ^0.5.0 |
| Frontend | Next.js | ^16.2.3 |
| Frontend | React | ^18 |
| Frontend | TypeScript | ^5 |
| Frontend | Tailwind CSS | ^3.4.1 |
| Frontend | SWR | ^2.2.5 |
| Frontend | Laravel Echo + pusher-js | 1.17.0 / 8.4.0 |
| Frontend | Axios | ^1.16.1 |
| Frontend | Lucide React | ^1.7.0 |
| Frontend | SweetAlert2 | ^11.26.24 |
| Banco de dados | PostgreSQL | 17 |
| Cache / Filas | Redis | 7-alpine |
| Proxy reverso | Traefik | externo (compartilhado) |
| Containers | Docker + Compose | — |
| Testes | PHPUnit | ^11.5.3 |

---

## Requisitos (desenvolvimento local)

- Docker >= 24 e Docker Compose v2
- Nenhuma dependência de PHP, Node ou Composer no host — tudo roda via containers

---

## Como Rodar Localmente

### 1. Copiar e ajustar o `.env`

```bash
cp backend/.env.example .env
```

As variáveis críticas para desenvolvimento local já vêm preenchidas no exemplo. Revise as seções de e-mail, Google OAuth e Stripe se quiser usar esses serviços.

### 2. Subir os containers de desenvolvimento

```bash
docker compose -f docker-compose-dev.yml up -d --build
```

### 3. Setup inicial do backend

```bash
# Gerar chave da aplicação
docker compose -f docker-compose-dev.yml exec app php artisan key:generate

# Rodar migrations (e seeds opcionais)
docker compose -f docker-compose-dev.yml exec app php artisan migrate --seed
```

### Portas expostas (dev)

| Serviço | URL |
|---|---|
| Backend (Laravel) | http://localhost:8080 |
| Frontend (Next.js) | http://localhost:3000 |
| Soketi (WebSockets) | ws://localhost:6001 |
| Mailpit (e-mail local) | http://localhost:8025 |
| Swagger UI (API docs) | http://localhost:8081 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## Variáveis de Ambiente

O arquivo de referência é `backend/.env.example`. As variáveis obrigatórias para funcionamento completo são:

| Variável | Descrição |
|---|---|
| `APP_KEY` | Chave de criptografia do Laravel (gerada via `artisan key:generate`) |
| `DB_HOST` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | Conexão PostgreSQL |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Conexão Redis |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth via Google (Socialite) |
| `MAIL_HOST` / `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP para Magic Link |
| `PUSHER_APP_ID` / `PUSHER_APP_KEY` / `PUSHER_APP_SECRET` | Soketi / WebSockets |
| `PUSHER_HOST` / `PUSHER_PORT` / `PUSHER_SCHEME` | Endereço do servidor Soketi |
| `STRIPE_KEY` / `STRIPE_SECRET` / `STRIPE_WEBHOOK_SECRET` | Pagamentos (Stripe) |
| `STRIPE_MONTHLY_PRICE_ID` / `STRIPE_YEARLY_PRICE_ID` | IDs dos planos no Stripe |
| `SENTRY_LARAVEL_DSN` | Monitoramento de erros (opcional) |
| `FRONTEND_URL` | URL do frontend (usada em redirecionamentos CORS/Sanctum) |
| `SANCTUM_STATEFUL_DOMAINS` | Domínios autorizados para cookies de sessão |
| `MAGIC_LINK_EXPIRE_MINUTES` | Validade do link de login (padrão: 15) |

Variáveis do frontend (prefixo `NEXT_PUBLIC_`) são injetadas em build-time via `docker-compose.yml` ou `.env`.

---

## Estrutura de Pastas

```
minha-fila/
├── backend/                  # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # BillingController, CompanyController, OrderController...
│   │   ├── Models/           # User, Company, Order, MagicLink, OrderSequence...
│   │   ├── Services/         # Serviços de domínio
│   │   └── Listeners/        # Event listeners (ex: broadcast)
│   ├── database/migrations/  # Histórico de schema
│   ├── routes/
│   │   ├── api.php           # Endpoints REST + webhooks Stripe
│   │   └── web.php           # Auth Google OAuth, Magic Link
│   └── .env.example
├── frontend/                 # Next.js (App Router)
│   └── src/
├── docker/
│   ├── php/
│   │   ├── Dockerfile        # PHP 8.3-fpm + Caddy (dev local)
│   │   └── Dockerfile.cli    # PHP CLI para queue worker e scheduler
│   └── frontend/
│       └── Dockerfile        # Build multi-stage Node 20-alpine
├── docs/                     # Documentação técnica detalhada
│   ├── ARCHITECTURE.md
│   ├── DEPLOY.md
│   ├── ENVIRONMENT.md
│   ├── REALTIME.md
│   └── openapi/              # Spec OpenAPI (Swagger)
├── infra/maintenance/        # Página de manutenção (Nginx) ativada durante deploy
├── docker-compose.yml        # Stack completa de produção
├── docker-compose-dev.yml    # Stack de desenvolvimento local
└── .github/workflows/
    ├── ci.yml                # PHPUnit + TypeScript check + auditorias de dependências
    └── deploy.yml            # Deploy automático no push para main
```

---

## Deploy

O deploy em produção é totalmente automatizado via GitHub Actions.

**Fluxo ao fazer push para `main`:**

1. CI executa PHPUnit (PostgreSQL real), type-check TypeScript e auditoria de dependências.
2. Após aprovação, o job `deploy` roda em um runner self-hosted na VPS (`minhafila-vps`).
3. O script de deploy:
   - Ativa a página de manutenção (Nginx via Traefik com prioridade máxima).
   - Clona o código para um diretório de build temporário.
   - Faz swap atômico de diretórios (zero-downtime).
   - Restaura `.env` de produção e `storage/` do backup anterior.
   - Sobe os containers via `docker compose up -d --build`.
   - Executa `composer install`, `artisan migrate`, `artisan optimize`.
   - Remove a página de manutenção.
   - Mantém os 3 últimos backups de deploy em `/tmp/minha-fila-backups/`.

**Secrets necessários no GitHub:**

| Secret | Descrição |
|---|---|
| `DEPLOY_PATH` | Caminho absoluto na VPS (ex: `/root/minha-fila`) |
| `DEPLOY_ENV_FILE` | Caminho para o `.env` de produção na VPS |

**Infraestrutura de produção:**

- Traefik compartilhado (`traefik_public`) gerencia TLS automático via Let's Encrypt.
- Soketi exposto em `/app` (porta 443) pelo mesmo domínio.
- Frontend Next.js em porta 3000, backend Laravel em porta 80 (interno).

Para detalhes completos, consulte [`docs/DEPLOY.md`](docs/DEPLOY.md).
