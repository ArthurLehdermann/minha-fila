# Minha Fila

SaaS multi-empresa para filas virtuais em tempo real (PWA + QR Code), sem senha de papel e sem hardware.

**BigWorks** · Produção: https://minhafila.meugarcom.app

## Produção (PRD)

| | |
|--|--|
| Path | `/root/minha-fila` |
| Secrets | `/root/minha-fila-secrets/.env.prod` |
| Containers | `minha_fila_app`, `_frontend`, `_queue`, `_scheduler`, `_redis`, `_soketi` (+ `_maintenance` no cutover) |
| Runner | `minhafila-vps` |
| Repo | `ArthurLehdermann/minha-fila` |

Deploy: push `main` -> CI (testes contra Postgres efêmero) -> runner: build do path + build do frontend em container -> maintenance -> swap atômico -> migrate -> limpeza.

## Stack

Laravel 12 · PHP 8.3 · Next.js 16 · Sanctum · Soketi (Pusher-compatible) · PostgreSQL 17 · Redis 7 · Traefik.

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
