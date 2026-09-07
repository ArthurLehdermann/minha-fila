# API

Base: `https://minhafila.meugarcom.app/api`. Este documento é a referência atual da API. O `openapi/openapi.yaml` está desatualizado (aponta `/health.php` e `/api/orders` sem empresa, e não cobre companies, billing nem monitoring); regenerá-lo é pendência do [ROADMAP](ROADMAP.md).

## Autenticação

- Google OAuth e Magic Link, unificados por e-mail (sem duplicar usuário). Tabela de apoio `user_providers (user_id, provider, provider_id)`.
- Rotas administrativas exigem token Sanctum (Bearer).
- Escrita de pedido/empresa passa por `auth:sanctum` + `tenant.access` + `plan.access`.

## Saúde

- `GET /api/health` -> `{ "status": "ok", "service": "minha-fila-backend", "time": "..." }`

## Auth (fora de `/api`, no backend)

- `GET /auth/google/redirect` -> 302 para o Google (scope e-mail/perfil).
- `GET /auth/google/callback` -> trata o retorno, vincula/usa o mesmo usuário por e-mail, grava em `user_providers`. Primeiro acesso cria empresa (id curto) e segue para o admin.
- `POST /auth/magic-link` - body `{ "email": "..." }` -> envia link de uso único que expira (`MAGIC_LINK_EXPIRE_MINUTES`).
- `GET /auth/magic-link/verify?token=...&email=...` -> valida e autentica; cria usuário no primeiro acesso.

Não há login por Apple.

## Empresas

- `GET /api/companies` (auth) - lista as empresas do usuário.
- `POST /api/companies` (auth + `plan.access`) - cria empresa.
- `GET /api/companies/{company}` - dados públicos da empresa (para a fila do cliente).
- `DELETE /api/companies/{company}` (auth + `tenant.access` + `plan.access`).
- `PATCH /api/companies/{company}/status` (auth + tenant + plan) - ativa/desativa.
- `PATCH /api/companies/{company}/labels` e `/name` (auth + tenant).
- `POST /api/companies/{company}/reset-sequence` (auth + tenant + plan) - zera a numeração.

## Pedidos

- `GET /api/companies/{company}/orders` - lista (público, para a fila).
- `GET /api/companies/{company}/orders/changes?since=...` - deltas por `sequence_id` (polling de fallback do realtime).
- `POST /api/companies/{company}/orders` (auth + tenant + plan, `throttle:30,1`) - cria pedido. Body `{ "label": "Crepe de frango" }` (label opcional).
- `PATCH /api/orders/{order}` (auth + tenant + plan) - muda o status (`waiting|preparing|ready|done`; aceita retroceder).

Resposta de pedido (exemplo):
```json
{ "id": 10, "label": "Crepe de frango", "status": "waiting", "sequence_id": 124, "updated_at": "2026-09-07 14:33" }
```

## Billing

Ver [BILLING](BILLING.md): `GET /api/billing/status`, `POST /api/billing/checkout`, `POST /api/billing/cancel`, `GET /api/billing/pix/{pagamento}`, `POST /api/mercadopago/webhook`.

## Monitoring

- `GET /api/monitoring/companies/{company}/queue` - contagens agregadas por status da fila.

  > Atenção: hoje esse endpoint é público (só protegido pelo UUID) e devolve um bloco `runtime` com `queue_connection` e `queue_size`. É a pendência #6 do [TECH_AUDIT](TECH_AUDIT_2026-04-03.md); tratar antes de divulgar a rota.
