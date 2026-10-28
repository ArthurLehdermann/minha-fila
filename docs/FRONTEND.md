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
  app/                 # App Router: landing (/ , /en, /es), /filas,
                       # /filas/[uuid] (público), /filas/[uuid]/admin
  components/
    landing/           # seções da landing (copy via lib/i18n/landing.ts)
  content/             # Termos / Privacidade (pt_BR, en, es)
  hooks/
  lib/
    api.ts             # cliente Axios
    echo.ts            # conexão Soketi + listen '.OrderUpdated'
    i18n/              # locales, dicionários do app, landing + SEO
```

## Landing e idiomas

- `/` (pt-BR), `/en` e `/es` reutilizam `components/landing/*`.
- Preço BRL na pt-BR; USD (US$ 9 / US$ 90) em en/es.
- Metadata, `hreflang`, `canonical` e `sitemap.ts` — ver [I18N.md](I18N.md).
- Seletor de idioma na NavBar/Footer navega entre as três URLs; login recebe `?lang=`.

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

Build no container (`docker/frontend/Dockerfile`, base `node:22-alpine`, porta 3000). No deploy, o runner faz `npm ci && npm run build` em `node:22-alpine`. Lint via `eslint .` (Next 16 não traz mais `next lint`). Sem Vercel.
