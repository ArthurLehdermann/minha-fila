# Frontend (Next.js)

Objetivo
- PWA mobile‑first para cliente e interfaces de admin/painéis

Stack
- Next.js 14 (App Router), TypeScript, Tailwind
- SWR/React Query
- Echo (Pusher client) para realtime

Estrutura (prevista)
src/
  app/
    layout.tsx
    page.tsx              # login (Google/Apple)
    [uuid]/page.tsx       # fila pública
    [uuid]/admin/page.tsx
    [uuid]/admin/config/page.tsx
  components/
    OrderCard.tsx
    StatusBadge.tsx
  hooks/
    useOrders.ts
  lib/
    api.ts
    echo.ts
  styles/
    globals.css

Realtime
- Conectar Echo ao host do Soketi e assinar `company.<uuid>`
- Revalidar SWR ao receber `OrderUpdated`

Admin (MVP)
- Criar pedido (gera `number` sequencial por empresa, descrição opcional).
- Zerar numeração (reseta `order_sequences`).
- Alterar status com confirmação (waiting → preparing → ready → done; pode retroceder).
- Listagens: 1) Prontos (destaque), 2) Fila, 3) Finalizados (colapsados).

Deploy
- Vercel com variáveis de ambiente (URLs da API e do Soketi, quando necessário)


