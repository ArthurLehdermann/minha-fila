# Roadmap (Sprint 1)

1) Autenticação Google/Apple + unificação por e‑mail (user_providers)
2) Fluxo primeiro acesso: criar empresa (UUID curto) e redirecionar `/[uuid]/admin`
3) API Laravel básica (CRUD de pedidos + reset sequence)
4) Broadcasting funcionando via Soketi (evento OrderUpdated)
5) PWA Next.js consumindo pedidos em tempo real (rota pública `/[uuid]`)
6) Admin básico para criar e mudar status (waiting → preparing → ready → done)
7) Painel TV inicial (listas: prontos, fila, finalizados)
6) Deploy backend na VPS via Docker Compose
8) Deploy frontend na Vercel

Próximas iterações (idéias)
- Relatórios (tempo médio, volume/hora)
- Multiloja / multiusuários
- Auditoria e métricas no backend


