# Frontend (Next.js 16)

PWA mobile-first para o cliente (fila pública) e para o admin/painel da empresa. Roda como container (`minha_fila_frontend`) atrás do Traefik, não na Vercel.

## Stack real (`frontend/package.json`)

- Next.js 16 (App Router), React 18, TypeScript, Tailwind 3.
- `axios` para a API, `swr` para revalidação.
- `laravel-echo` + `pusher-js` para realtime.
- `lucide-react` (ícones), `sweetalert2` (diálogos), `qrcode` (QR Code do cliente).

Não usa React Query.

## Estrutura (`frontend/src`)

```
src/
  app/                 # App Router: landing, /fila (dashboard),
                       # /fila/[uuid] (público), /fila/[uuid]/admin
  components/
  hooks/
  lib/
    api.ts             # cliente Axios
    echo.ts            # conexão Soketi + listen '.OrderUpdated'
```

## Realtime

- Conecta ao Soketi com as chaves `NEXT_PUBLIC_PUSHER_*` e assina `company.{uuid}`.
- Ao receber `.OrderUpdated`, revalida a lista (SWR). Fallback por polling em `orders/changes`.
- Pendência #4 do [TECH_AUDIT](TECH_AUDIT_2026-04-03.md): pedido recém-criado pode só entrar no refetch seguinte.

## Admin

- Criar pedido (label opcional; número sequencial por empresa).
- Zerar numeração (reset de `order_sequences`).
- Mudar status com confirmação (waiting -> preparing -> ready -> done; aceita retroceder).
- Listagens: prontos em destaque, fila e finalizados.

## Build e deploy

Build no container (`docker/frontend/Dockerfile`, porta 3000). No deploy, o runner faz `npm ci && npm run build`. Sem Vercel.
