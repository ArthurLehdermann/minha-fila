# Deploy e Operação (VPS)

Roda em VPS orquestrado por Docker Compose, com Traefik de proxy reverso e TLS. Deploy automático a cada push em `main` pelo runner `minhafila-vps`.

## Diretórios

- `/root/minha-fila/`: raiz da aplicação (código, `docker-compose.yml`).
- `/root/minha-fila-secrets/.env.prod`: segredos de produção.
- `/root/.minha-fila-build/`: staging do build (mesmo filesystem, para swap atômico por `mv`).
- Backup do release anterior movido para `/tmp/minha-fila-backups/` após sucesso (some no reboot, sem lixo em `/root`).

## Pipeline (GitHub Actions)

`.github/workflows/ci.yml` roda os testes. `.github/workflows/deploy.yml`, no push em `main`:

1. **CI**: sobe um Postgres efêmero numa rede docker temporária, roda migrate + `php artisan test`, derruba tudo ao fim.
2. **Build**: prepara a versão nova em `/root/.minha-fila-build`; builda o frontend em container `node:20-alpine` (`npm ci && npm run build`).
3. **Maintenance**: sobe a página de manutenção durante o cutover.
4. **Swap atômico**: `mv` troca `/root/minha-fila` pela nova versão.
5. **Resgate de estado**: leva `.env.prod` e `storage/` para a nova estrutura.
6. **Up + migrate**: `docker compose up -d` e `migrate --force`.
7. **Limpeza**: remove maintenance e move o backup para `/tmp`.

## Google OAuth em produção

- Redirect URI autorizada no Google Cloud: `https://minhafila.meugarcom.app/auth/google/callback`.
- `GOOGLE_REDIRECT_URI` no `.env.prod` tem que bater exatamente.

## Mercado Pago em produção

- Credenciais `APP_USR-*` no `.env.prod` (`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`).
- Webhook configurado no painel do MP apontando para `https://minhafila.meugarcom.app/api/mercadopago/webhook`, com `MP_WEBHOOK_SECRET` igual à chave secreta do webhook.
- `preapproval_plan_id` de cada ciclo em `MP_PLAN_ID_MENSAL` / `MP_PLAN_ID_ANUAL`.

## CLI comum

```sh
docker compose logs -f --tail=200 app
docker compose exec app php artisan [comando]
docker compose exec app php artisan optimize:clear
```

## Manutenção e segurança

- **Banco**: Postgres roda como container `db` na rede `minhafila_internal`, fora deste compose. Configurar snapshot/backup do volume desse container (não há off-site por padrão).
- **TLS**: Traefik renova os certificados Let's Encrypt de `minhafila.meugarcom.app`.
- **Segredos**: editar sempre em `/root/minha-fila-secrets/.env.prod` e reiniciar os containers; nunca dentro de `minha-fila/`.
