# Deploy

Backend (VPS + Traefik)
1) Criar rede externa do Traefik (uma vez): `docker network create traefik`
2) Ajustar `.env` conforme `docs/ENVIRONMENT.md`
3) Revisar labels/hosts no `docker-compose.yml`
4) Subir: `docker compose up -d --build`
5) Gerar `APP_KEY`: `docker compose exec app php artisan key:generate`
6) Migrar DB: `docker compose exec app php artisan migrate --seed`
7) Verificar logs: `docker compose logs -f --tail=200`

Google OAuth (Produção)
1) No Google Cloud Console, crie um “OAuth 2.0 Client ID (Web)”
   - Authorized redirect URI:
     - `https://minhafila.vps.bigworks.com.br/auth/google/callback`
     - (Stage) `https://minhafila-stage.vps.bigworks.com.br/auth/google/callback`
2) No servidor de produção (pasta raiz do projeto), edite `.env`:
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `GOOGLE_REDIRECT_URI=${APP_URL}/auth/google/callback`
3) Reinicie o app:
   - `docker compose restart app`
4) Teste:
   - Acesse `https://minhafila.vps.bigworks.com.br/auth/google/redirect`
   - Deve redirecionar para “accounts.google.com”.

Magic Link (Produção)
1) Configure SMTP no `.env` (MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_*).
2) Defina `MAGIC_LINK_EXPIRE_MINUTES` (ex.: 15).
3) Reinicie o app: `docker compose restart app`.
4) Teste:
   - `POST /auth/magic-link` com `{"email":"seu@email"}`
   - Abra o link recebido no e‑mail (deve autenticar e redirecionar).

Frontend (Vercel)
- Conectar repo do frontend, configurar envs (URL da API, etc.)
- Build padrão do Next.js (Node LTS)

Observações
- Certifique-se de que o resolver ACME (`letsencrypt`) do Traefik tem storage configurado no host do Traefik.
- Monitore saúde dos serviços (`depends_on` + healthchecks).


