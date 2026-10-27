# Minha Fila

SaaS multi-empresa para filas virtuais em tempo real (PWA + QR Code), sem senha de papel e sem hardware.

**BigWorks** · Produção: https://minha-fila.meugarcom.app

## Produção (PRD)

| | |
|--|--|
| App | clone no host do deploy (paths definidos em `.github/workflows/deploy.yml`) |
| Secrets | fora do clone, no host do deploy (nunca versionados) |
| Containers | `minha_fila_app`, `_frontend`, `_queue`, `_scheduler`, `_redis`, `_soketi` (+ `_maintenance` no cutover) |
| Runner | self-hosted `minha-fila-vps` (VPS de produção) |
| Repo | `ArthurLehdermann/minha-fila` |

Deploy: push `main` → CI no runner (Postgres efêmero) → build do path + frontend em `node:22-alpine` → maintenance → swap atômico → migrate → limpeza.

## Stack

Laravel 12 · PHP 8.3.36 · Next.js 16 (Node 22) · Sanctum · Soketi Node 22 · PostgreSQL 17 · Redis 7 · Traefik.

Pagamento: Mercado Pago (assinatura no cartão via preapproval + Pix avulso por ciclo). Não usa Stripe.

## Funcionalidades

- Multi-empresa: um login gerencia várias filas, isoladas por `company_id`/UUID curto.
- Painel de senhas com status waiting -> preparing -> ready -> done (e retrocesso).
- Fila pública em tempo real por QR Code, sem instalar app.
- Login por Google OAuth e Magic Link (sem senha).
- Assinatura mensal ou anual pelo Mercado Pago, com gate de acesso por plano.

## Documentação

Índice em [`docs/`](docs/): visão de produto, arquitetura, API, billing, realtime, ambiente, deploy, docker, backend e frontend. A auditoria técnica de 2026-04-03 e as pendências abertas estão em [`docs/TECH_AUDIT_2026-04-03.md`](docs/TECH_AUDIT_2026-04-03.md).

---

Mantido por [BigWorks](https://bigworks.com.br).
