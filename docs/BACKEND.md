# Backend (Laravel 12)

API REST + eventos de broadcast em tempo real. Persistência em PostgreSQL 17, cache/filas em Redis, WebSocket via Soketi.

## Estrutura real (`backend/app`)

```
app/
  Events/
    OrderUpdated.php            # ShouldBroadcast, canal company.{uuid}
  Models/
    User.php  UserProvider.php  Company.php  Order.php
    OrderSequence.php  MagicLink.php
    Assinatura.php  Pagamento.php            # billing Mercado Pago
  Http/Controllers/
    CompanyController.php  OrderController.php
    BillingController.php  MercadoPagoWebhookController.php
    MonitoringController.php  UserSettingsController.php
    Auth/GoogleController.php  (+ Magic Link)
  Http/Middleware/
    EnsureTenantAccess.php      # 'tenant.access'
    EnsurePlanAccess.php        # 'plan.access'
  Services/
    AssinaturaService.php       # ciclos, cartão (preapproval) e Pix
routes/  api.php  web.php  console.php
database/migrations/            # inclui resíduo Cashier (subscriptions/meter), não usado
```

## Autenticação e identidade

- Google OAuth (Socialite) e Magic Link. Unificação por e-mail via `user_providers (user_id, provider, provider_id)`.
- Primeiro acesso sem empresa: cria empresa com id curto (Sqids) e leva ao admin.
- Sem Apple Sign-in.

## Modelo de dados (resumo)

- `users` (com `acesso_expira_em`, `timezone`), `user_providers`.
- `companies` (`id` curto Sqids, `id_int`, `owner_id`, `name`, `status`, labels de estágio, `qr_code_url`).
- `orders` (`company_id`, `label` nullable, `status` waiting|preparing|ready|done, `sequence_id`, timestamps).
- `order_sequences` (`company_id`, contador) - `nextFor` atômico com `lockForUpdate`.
- `magic_links` (com `code_hash`), `assinaturas`, `pagamentos` (Pix/cartão).

## Rotas

Contrato completo em [API](API.md). Escrita exige `auth:sanctum` + `tenant.access` + `plan.access`; criação de pedido tem `throttle:30,1`.

## Testes

`php artisan test` (SQLite em memória). Cobrem health, Google OAuth, Magic Link, billing status, `plan.access`, limites de empresa, reset de sequência, id de empresa, CRUD de pedidos, monitoring e unidades (`OrderSequence`, `MagicLink`). São 112 testes. Os dois de `CompanyIdTest` dependem da extensão `bcmath`/`gmp` (Sqids) e falham em imagem PHP sem essa extensão; a imagem de produção a inclui. Lacuna atual: falta teste de caminho feliz do checkout/webhook do Mercado Pago.
