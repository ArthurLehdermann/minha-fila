# Deploy e Operação em Produção (VPS)

O Minha Fila opera em um ambiente VPS (Debian/Ubuntu) orquestrado via Docker Compose, utilizando Traefik como Proxy Reverso e Ingress Controller.

Estrutura de Diretórios Padronizada
-----------------------------------
A organização do servidor segue este padrão rigoroso no `/root/`:

- `/root/minha-fila/`: Raiz da aplicação. Contém o código-fonte, `docker-compose.yml` e volumes persistentes.
- `/root/minha-fila-secrets/`: Pasta protegida para segredos de produção (ex: `.env.prod`).
- `/root/.minha-fila-build/`: Staging temporário (mesmo FS que `/root/minha-fila` pra rename atômico).
- `/root/.minha-fila-backup-<ts>/`: Backup do release anterior durante o swap; movido pra `/tmp/minha-fila-backups/` após sucesso (sumiu no reboot, sem lixo em `/root`).

Deploy Automatizado (GitHub Actions)
------------------------------------
O deploy é realizado automaticamente a cada push na branch `main`.

1. **Build Atômico**: O Runner prepara a nova versão em `/root/.minha-fila-build`.
2. **Maintenance Mode**: Ativa uma página de manutenção temporária.
3. **Atomic Swap**: Troca o diretório `/root/minha-fila` pelo novo build via `mv`.
4. **Resgate de Estado**: Copia o `.env.prod` e a pasta `storage/` (volumes locais) para a nova estrutura.
5. **Up Containers**: Reinicia os serviços via `docker compose up -d`.

Configuração do Google OAuth
----------------------------
Para o login via Google em produção, utilize as seguintes URLs no Google Cloud Console:

- **Authorized redirect URI**: `https://minha-fila.meugarcom.app/auth/google/callback`

Certifique-se de que o `GOOGLE_REDIRECT_URI` no `.env.prod` aponte exatamente para esta URL.

Operações Comuns via CLI
------------------------
Mesmo com deploy automático, algumas ações podem ser necessárias via terminal no VPS:

- **Ver logs em tempo real**: `docker compose logs -f app`
- **Executar Comandos Artisan**: `docker compose exec app php artisan [comando]`
- **Limpar Cache**: `docker compose exec app php artisan optimize:clear`
- **Forçar Rebuild**: `docker compose build --no-cache && docker compose up -d`

Manutenção e Segurança
----------------------
- **Backups**: O banco PostgreSQL utiliza volumes Docker persistentes (`postgres_data`). Recomenda-se configurar snapshots diários do volume.
- **TLS**: O Traefik renova automaticamente os certificados Let's Encrypt para `minha-fila.meugarcom.app`.
- **Secrets**: Nunca edite arquivos dentro de `minha-fila/` diretamente; altere sempre em `/root/minha-fila-secrets/.env.prod` e reinicie os containers.
