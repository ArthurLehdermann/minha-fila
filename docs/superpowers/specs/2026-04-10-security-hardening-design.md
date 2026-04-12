# Security Hardening — Design Spec

**Date:** 2026-04-10  
**Scope:** Frontend (Next.js) + Backend (Laravel)  
**Status:** Approved

---

## Context

App prestes a ir para produção. Auditoria identificou vulnerabilidades reais e falsos positivos.
Este spec cobre apenas itens reais, priorizados por severidade.

### Falsos positivos descartados
- `order.label` XSS — React escapa JSX automaticamente
- CORS — `config/cors.php` já restringe a `FRONTEND_URL`
- `googleRedirectUrl` fallback — design intencional documentado no código
- QR code logo — usa `/logo.png` local, não domínio externo

---

## Arquitetura Geral

### Auth: httpOnly Cookie (Abordagem B)

**Fluxo atual:**
```
Auth → Backend retorna {token, user} → Frontend salva token em localStorage → Axios injeta Bearer header
```

**Fluxo novo:**
```
Auth → Backend seta cookie httpOnly → Frontend salva só user (não-sensível) → 
Axios envia cookie automaticamente (withCredentials) → Backend middleware lê cookie
```

**Por que Abordagem B:**
- Mantém modelo Sanctum existente
- Mudança mínima nas rotas e controllers
- Sem refactor de CSRF (Abordagem A) ou latência extra (Abordagem C)

---

## Mudanças por Componente

### Backend (Laravel)

#### 1. Middleware `AuthenticateFromCookie`
- Novo arquivo: `app/Http/Middleware/AuthenticateFromCookie.php`
- Lê cookie `auth_token` do request
- Injeta como `Authorization: Bearer {token}` no request antes do Sanctum processar
- Alias: `auth.cookie` em `bootstrap/app.php`
- Aplicado nas rotas `auth:sanctum` existentes (substituição sem alterar rotas)

#### 2. MagicLinkController — método `verify`
- Após criar token Sanctum, setar cookie httpOnly em vez de retornar token no body
- Retornar apenas `{user: {...}}` (sem token)
- Cookie: `auth_token`, HttpOnly, Secure, SameSite=Lax, Path=/, MaxAge=7 dias

#### 3. GoogleController — método `callback`
- Mesma mudança: setar cookie httpOnly, retornar só `{user: {...}}`
- Redirect com cookie já setado (sem token na URL/query string)

#### 4. Nova rota `POST /auth/logout`
- Controller limpa cookie `auth_token`
- Revoga token Sanctum do banco
- Retorna 204

#### 5. Rate limiting em criação de orders
- Arquivo: `routes/api.php`
- Adicionar `throttle:30,1` em `POST /api/companies/{company}/orders`
- 30 requests por minuto por IP/usuário

#### 6. Token expiration
- `config/sanctum.php`: setar `expiration` para `10080` (7 dias em minutos)

### Frontend (Next.js)

#### 7. `lib/auth.ts` — remover token do localStorage
- Remover armazenamento de `auth_token` do localStorage
- Manter armazenamento de `auth_user` (dados não-sensíveis: id, name, email)
- `isAuthenticated()`: checar presença de `auth_user` no localStorage (hint client-side)
- A validação real do token ocorre no backend (cookie httpOnly enviado automaticamente)
- Sessão expirada: API retorna 401 → interceptor redireciona para login e limpa `auth_user`
- `clearAuth()`: remover `auth_user` do localStorage (token httpOnly é limpo pelo backend no logout)

#### 8. `lib/api.ts` — Axios com cookies
- Adicionar `withCredentials: true` na instância Axios
- Remover interceptor que injeta `Authorization` header (cookie enviado automaticamente)
- Manter interceptor de resposta 402 (plan-blocked)

#### 9. `middleware.ts` — proteção server-side de rotas
- Novo arquivo: `src/middleware.ts`
- Ler cookie `auth_token` via `request.cookies.get('auth_token')`
- Redirecionar para `/auth/login` se não autenticado
- Proteger: `/filas/:uuid/admin`, `/filas`, `/billing`
- Rotas públicas passam livres: `/filas/:uuid` (sem /admin), `/auth/*`, `/`

#### 10. `next.config.mjs` — headers de segurança
- CSP: Next.js requer `'unsafe-inline'` para scripts de hidratação (sem nonce customizado); usar política restritiva mas funcional:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (necessário para Next.js dev + hydration)
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: https://minha-fila.meugarcom.app https://minha-fila.meugarcom.app`
  - `connect-src 'self' https://minha-fila.meugarcom.app wss://minha-fila.meugarcom.app`
  - `font-src 'self'`
  - `object-src 'none'`
  - `base-uri 'self'`
  - `frame-ancestors 'none'`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### 11. `src/app/layout.tsx` — acessibilidade
- Remover `userScalable: false`
- Remover `maximumScale: 1`
- Manter `initialScale: 1, width: 'device-width'`

#### 12. `public/sw-notify.js` — versionamento
- Registrar SW com parâmetro de versão: `/sw-notify.js?v=2`
- Atualizar em `src/app/filas/[uuid]/page.tsx`

#### 13. `src/hooks/useOrders.ts` — polling
- Aumentar `refreshInterval` de 1000ms para 5000ms
- Manter `refreshWhenHidden: true` (necessário para notificações em background)
- WebSocket (Echo/Pusher) já cobre atualizações em tempo real

#### 14. Atualização Next.js
- `package.json`: atualizar `next` de `14.2.14` para `14.2.29` (última patch sem CVE na série 14) ou `15.x`
- Rodar `npm audit --fix`

---

## Plano de Execução Paralela

| Track | Escopo | Dependência |
|-------|--------|-------------|
| 1 | Backend: cookie auth (items 1–4, 6) | — |
| 2 | Frontend config: headers, Next.js, minor fixes (items 10–14) | — |
| 3 | Backend: rate limiting orders (item 5) | — |
| 4 | Frontend auth: localStorage removal, withCredentials, middleware.ts (items 7–9) | Track 1 concluído |

Tracks 1, 2, 3 paralelos. Track 4 após Track 1.

---

## Verificação

1. **Auth flow magic link:** receber email → clicar link → cookie setado → página admin acessível → refresh mantém sessão → logout limpa cookie
2. **Auth flow Google:** redirect → callback → cookie setado → sessão ativa
3. **Middleware:** acessar `/filas/uuid/admin` sem cookie → redirect `/auth/login`
4. **XSS check:** sem token visível em `localStorage`, `document.cookie`, ou JS
5. **Headers:** `curl -I https://minha-fila.meugarcom.app` → confirmar CSP, HSTS presentes
6. **Rate limit:** 31 POSTs em 1 minuto para `/api/companies/uuid/orders` → 429 no 31º
7. **npm audit:** 0 vulnerabilidades críticas/altas após fix
8. **Polling:** DevTools Network tab → requests a cada 5s, não 1s

---

## Arquivos Críticos Modificados

**Backend:**
- `app/Http/Middleware/AuthenticateFromCookie.php` (novo)
- `app/Http/Controllers/Auth/MagicLinkController.php`
- `app/Http/Controllers/Auth/GoogleController.php`
- `routes/api.php`
- `routes/web.php`
- `bootstrap/app.php`
- `config/sanctum.php`

**Frontend:**
- `src/middleware.ts` (novo)
- `src/lib/auth.ts`
- `src/lib/api.ts`
- `src/app/layout.tsx`
- `src/hooks/useOrders.ts`
- `src/app/filas/[uuid]/page.tsx`
- `next.config.mjs`
- `package.json`
