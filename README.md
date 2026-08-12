# Minha Fila

SaaS multi-empresa para filas virtuais em tempo real (PWA + QR Code), sem hardware de senha de papel.

**BigWorks** · Produção: https://minhafila.meugarcom.app

## Produção (PRD)

| | |
|--|--|
| Path | `/root/minha-fila` |
| Secrets | `/root/minha-fila-secrets/.env.prod` |
| Containers | `minha_fila_app`, `_frontend`, `_queue`, `_scheduler`, `_redis`, `_soketi` (+ `_maintenance`) |
| Runner | `minhafila-vps` |
| Repo | `ArthurLehdermann/minha-fila` |

Deploy: push `main` → CI/testes → runner: build path + npm frontend → maintenance → swap → migrate → limpeza.

## Stack

Laravel 12 · PHP 8.3 · Next.js · Sanctum · Cashier · Soketi · PostgreSQL · Redis · Traefik

## Funcionalidades

- Multi-empresa, painel admin de senhas, fila pública em tempo real
- Google OAuth + Magic Link
- Planos Stripe

---

Mantido por [BigWorks](https://bigworks.com.br).
