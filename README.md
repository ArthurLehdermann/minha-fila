Minha Fila SaaS
===============

Plataforma SaaS multi-empresa para gestão de filas virtuais em tempo real. Ideal para lanchonetes, creperias e food trucks que desejam profissionalizar o atendimento sem hardware complexo. 

🌐 **Domínio Unificado**: `https://minhafila.meugarcom.app`

Principais Funcionalidades
--------------------------
- **Multi-empresa**: Gerencie múltiplos estabelecimentos com uma única conta.
- **Painel Administrativo**: Criação de pedidos e controle de status (Aguardando, Preparando, Pronto, Entregue).
- **Acompanhamento Realtime**: Clientes acompanham o status via PWA (QR Code) com atualizações instantâneas.
- **Autenticação Flexível**: Login via Google OAuth ou Magic Link por e-mail.
- **Infraestrutura Ágil**: Backend Laravel + Frontend Next.js orquestrados via Docker e Traefik.

Links Rápidos
-------------
- [Arquitetura](docs/ARCHITECTURE.md): Visão técnica do SaaS e fluxo de dados.
- [Deploy na Produção](docs/DEPLOY.md): Passo a passo para VPS e padrão de diretórios.
- [Ambiente (.env)](docs/ENVIRONMENT.md): Configuração de variáveis locais e globais.
- [Overview do Produto](docs/OVERVIEW.md): Benefícios e guia de uso.
- [Realtime & Broadcast](docs/REALTIME.md): WebSockets e canais Soketi/Pusher.

Stack Tecnológica
-----------------
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Laravel 11, PostgreSQL, Redis.
- **Comunicação**: WebSockets via Soketi (Pusher-compatible), Laravel Echo.
- **Proxy/Ingress**: Traefik com TLS automático (Let's Encrypt).

Desenvolvimento Local
---------------------
Pré-requisitos: Docker e Docker Compose.

1. **Clonar e configurar o ambiente**:
   ```bash
   cp .env.example .env
   # Edite o .env se necessário
   ```

2. **Subir os containers**:
   ```bash
   docker compose -f docker-compose-dev.yml up -d --build
   ```

3. **Gerar chaves e migrações**:
   ```bash
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan migrate --seed
   ```

O frontend estará disponível em `http://localhost:3000` e a documentação técnica adicional na pasta `docs/`.

Licença
-------
Privado / Arthur Lehdermann.
