# Deploy e Operação

Roda na VPS de produção orquestrado por Docker Compose, com Traefik de proxy reverso e TLS. CI e deploy rodam no runner self-hosted `minha-fila-vps` (mesmo host) a cada push em `main`.

## Layout no host do deploy

Os paths concretos (clone da app, staging de build, arquivo de segredos, backup temporário) estão em `.github/workflows/deploy.yml`. Em resumo:

- **App**: raiz com código e `docker-compose.yml`.
- **Secrets**: arquivo de produção fora do clone (nunca versionado).
- **Build staging**: diretório no mesmo filesystem, para swap atômico por `mv`.
- **Backup do release anterior**: movido para `/tmp` após sucesso (some no reboot).

## Pipeline (GitHub Actions)

`.github/workflows/ci.yml` e `.github/workflows/deploy.yml` usam o runner self-hosted (não há jobs `ubuntu-latest`). No push em `main`:

1. **CI**: sobe um Postgres efêmero numa rede docker temporária, roda migrate + testes na imagem `minha-fila:app`, derruba tudo ao fim.
2. **Build**: prepara a versão nova no staging; builda backend assets e frontend em container `node:22-alpine` (`npm ci && npm run build`).
3. **Maintenance**: sobe a página de manutenção durante o cutover.
4. **Swap atômico**: `mv` troca o clone de produção pela nova versão.
5. **Resgate de estado**: leva o arquivo de segredos e `storage/` para a nova estrutura.
6. **Up + migrate**: `docker compose up -d` e `migrate --force`.
7. **Limpeza**: remove maintenance e move o backup para `/tmp`.

Imagens base Docker e do compose têm Dependabot semanal (`.github/dependabot.yml`); bump major fica manual.

## Google OAuth em produção

- Redirect URI autorizada no Google Cloud: `https://minha-fila.meugarcom.app/auth/google/callback`.
- `GOOGLE_REDIRECT_URI` nos segredos de produção tem que bater exatamente.

## Mercado Pago em produção

- Credenciais `APP_USR-*` nos segredos (`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`).
- Webhook configurado no painel do MP apontando para `https://minha-fila.meugarcom.app/api/mercadopago/webhook`, com `MP_WEBHOOK_SECRET` igual à chave secreta do webhook.
- `preapproval_plan_id` de cada ciclo em `MP_PLAN_ID_MENSAL` / `MP_PLAN_ID_ANUAL`.

## CLI comum

```sh
docker compose logs -f --tail=200 app
docker compose exec app php artisan [comando]
docker compose exec app php artisan optimize:clear
```

## Manutenção e segurança

- **Banco**: Postgres de produção não está neste compose; o backend aponta para o container `db` na rede `minhafila_internal` (host em `DB_HOST` nos segredos). Configurar snapshot/backup do volume desse container (não há off-site por padrão).
- **TLS**: Traefik renova os certificados Let's Encrypt de `minha-fila.meugarcom.app`.
- **Segredos**: editar sempre no arquivo fora do clone e reiniciar os containers; nunca dentro do diretório da app.
