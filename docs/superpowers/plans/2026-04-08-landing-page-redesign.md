# Landing Page Redesign — Minha Fila

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a landing page atual (técnica/cyan) por uma página de conversão focada em dor e benefício, com tema âmbar, para operadores de restaurantes.

**Architecture:** Abordagem B — `page.tsx` orquestra 7 componentes de seção em `src/components/landing/`. Cada seção é um Server Component estático (sem `'use client'`). Tailwind puro, sem novas dependências.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Modify | `frontend/src/app/page.tsx` | Orquestra seções, remove código atual |
| Create | `frontend/src/components/landing/NavBar.tsx` | Nav fixa com logo e CTAs |
| Create | `frontend/src/components/landing/HeroSection.tsx` | Hero com badge, H1, sub, CTAs, mockup |
| Create | `frontend/src/components/landing/DorSection.tsx` | 4 cards de dor |
| Create | `frontend/src/components/landing/SolucaoSection.tsx` | 3 passos da solução |
| Create | `frontend/src/components/landing/DiferenciaisSection.tsx` | Sem app / Sem hardware / 5 minutos |
| Create | `frontend/src/components/landing/PricingSection.tsx` | 2 planos: mensal e anual |
| Create | `frontend/src/components/landing/CtaFinalSection.tsx` | CTA final agressivo |
| Create | `frontend/src/components/landing/Footer.tsx` | © + tagline |

---

## Task 1: Configurar cor âmbar no Tailwind

**Files:**
- Modify: `frontend/tailwind.config.ts`

- [ ] **Substituir a paleta `brand` por âmbar e manter background escuro**

```ts
// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Commit**

```bash
cd frontend
git add tailwind.config.ts
git commit -m "style: swap brand palette to amber for landing redesign"
```

---

## Task 2: NavBar

**Files:**
- Create: `frontend/src/components/landing/NavBar.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/NavBar.tsx
import Link from 'next/link'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-sm font-black text-black">
            M
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
            Minha Fila
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            Entrar
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-brand-400 sm:px-4 sm:text-sm"
          >
            Criar minha fila grátis
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/NavBar.tsx
git commit -m "feat(landing): add NavBar with amber branding"
```

---

## Task 3: HeroSection

**Files:**
- Create: `frontend/src/components/landing/HeroSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/HeroSection.tsx
import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      className="px-4 py-24 sm:px-6"
      style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #0d0d0d 65%)' }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-300">
          🔥 Fila virtual para restaurantes
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white lg:text-6xl">
          Chega de fila bagunçada
          <br />
          <span className="text-brand-400">no seu atendimento.</span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
          Organize os pedidos, elimine a confusão e atenda mais rápido.
          Tudo pelo celular, sem instalar nada.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/login"
            className="w-full rounded-xl bg-brand-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-brand-500 sm:w-auto"
          >
            Criar minha fila grátis →
          </Link>
          <a
            href="#como-funciona"
            className="w-full rounded-xl border border-white/15 bg-white/8 px-8 py-4 text-lg font-medium text-white transition hover:bg-white/12 sm:w-auto"
          >
            Ver como funciona
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">7 dias grátis · Sem cartão de crédito</p>

        {/* Product mockup */}
        <div className="mx-auto mt-14 max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/60">
          {/* Phone status bar */}
          <div className="flex items-center justify-between bg-[#111] px-4 py-2 text-[10px] text-gray-500">
            <span>https://minha-fila.meugarcom.app/</span>
            <span>🔒</span>
          </div>
          {/* Queue mockup */}
          <div className="p-4">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-400">
              Fila ao vivo
            </p>
            {[
              { pos: 1, nome: 'Carlos', status: 'Preparando', color: 'text-brand-400' },
              { pos: 2, nome: 'Fernanda', status: 'Na fila', color: 'text-gray-400' },
              { pos: 3, nome: 'Rafael', status: 'Na fila', color: 'text-gray-400' },
            ].map(({ pos, nome, status, color }) => (
              <div
                key={pos}
                className="mb-2 flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-600">#{pos}</span>
                  <span className="text-sm font-semibold text-white">{nome}</span>
                </div>
                <span className={`text-xs font-medium ${color}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat(landing): add HeroSection with amber hero and inline queue mockup"
```

---

## Task 4: DorSection

**Files:**
- Create: `frontend/src/components/landing/DorSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/DorSection.tsx
const dores = [
  { emoji: '😤', texto: '"Já tá pronto?" — o cliente pergunta pela quinta vez.' },
  { emoji: '😵', texto: 'Pedido entregue errado porque a fila era só na cabeça do operador.' },
  { emoji: '😠', texto: 'Cliente que chegou depois recebeu antes. Reclamação na hora.' },
  { emoji: '📢', texto: 'Gritando nome no salão cheio...' },
]

export function DorSection() {
  return (
    <section className="border-t border-white/8 bg-[#0d0d0d] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-500">
          Você conhece esse caos
        </p>
        <h2 className="mb-12 text-center text-4xl font-extrabold text-white">Parece familiar?</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {dores.map(({ emoji, texto }) => (
            <div
              key={texto}
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-[#161616] px-6 py-5"
            >
              <span className="text-2xl">{emoji}</span>
              <p className="text-sm leading-relaxed text-gray-300">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/DorSection.tsx
git commit -m "feat(landing): add DorSection with 4 pain point cards"
```

---

## Task 5: SolucaoSection

**Files:**
- Create: `frontend/src/components/landing/SolucaoSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/SolucaoSection.tsx
const passos = [
  {
    emoji: '📱',
    titulo: 'Cliente lê o QR Code',
    descricao: 'Na mesa ou balcão. Sem app para instalar.',
  },
  {
    emoji: '📋',
    titulo: 'Entra na fila automaticamente',
    descricao: 'Situação dos pedidos em tempo real no painel do operador.',
  },
  {
    emoji: '✅',
    titulo: 'Chamado quando ficar pronto',
    descricao: 'Notificação no celular. Sem grito, sem confusão.',
  },
]

export function SolucaoSection() {
  return (
    <section
      id="como-funciona"
      className="border-t border-white/8 bg-[#111] px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          A solução
        </p>
        <h2 className="mb-4 text-4xl font-extrabold text-white">
          Fila inteligente, atendimento tranquilo
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-lg text-gray-400">
          Cada cliente sabe onde está. Você sabe quem é o próximo.
          Sem papel, sem totem, sem app.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {passos.map(({ emoji, titulo, descricao }) => (
            <div
              key={titulo}
              className="rounded-2xl border border-white/8 bg-[#161616] px-6 py-8"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-2xl">
                {emoji}
              </div>
              <h3 className="mb-2 font-bold text-white">{titulo}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/SolucaoSection.tsx
git commit -m "feat(landing): add SolucaoSection with 3-step flow"
```

---

## Task 6: DiferenciaisSection

**Files:**
- Create: `frontend/src/components/landing/DiferenciaisSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/DiferenciaisSection.tsx
const diferenciais = [
  { destaque: 'Sem app', descricao: 'O cliente usa pelo navegador. Zero instalação.' },
  { destaque: 'Sem hardware', descricao: 'Sem totem, sem senha física, sem equipamento.' },
  { destaque: '5 minutos', descricao: 'Da conta criada até a primeira fila funcionando.' },
]

export function DiferenciaisSection() {
  return (
    <section className="border-t border-white/8 bg-[#0d0d0d] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-white">
          Sem complicação, sem desculpa
        </h2>

        <div className="grid gap-8 text-center sm:grid-cols-3">
          {diferenciais.map(({ destaque, descricao }) => (
            <div key={destaque}>
              <p className="text-4xl font-black text-brand-400">{destaque}</p>
              <p className="mt-2 text-sm text-gray-400">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/DiferenciaisSection.tsx
git commit -m "feat(landing): add DiferenciaisSection"
```

---

## Task 7: PricingSection

**Files:**
- Create: `frontend/src/components/landing/PricingSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/PricingSection.tsx
import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="border-t border-white/8 bg-[#111] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          Preço
        </p>
        <h2 className="mb-12 text-4xl font-extrabold text-white">Simples assim</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Mensal */}
          <div className="rounded-2xl border border-white/8 bg-[#161616] px-8 py-10">
            <p className="mb-2 text-sm text-gray-400">Mensal</p>
            <p className="text-5xl font-black text-white">
              R$&nbsp;9,90
              <span className="text-lg font-normal text-gray-400">/mês</span>
            </p>
            <p className="mt-3 text-sm text-gray-500">Cancele quando quiser</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/12"
            >
              Começar grátis →
            </Link>
          </div>

          {/* Anual */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-[#1a0e00] px-8 py-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-4 py-1 text-xs font-black text-black">
              MELHOR VALOR
            </div>
            <p className="mb-2 text-sm text-brand-300">Anual</p>
            <p className="text-5xl font-black text-white">
              R$&nbsp;99,90
              <span className="text-lg font-normal text-gray-400">/ano</span>
            </p>
            <p className="mt-3 text-sm text-gray-500">Menos de R$&nbsp;8,33/mês</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              Começar grátis →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          7 dias grátis em qualquer plano. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/PricingSection.tsx
git commit -m "feat(landing): add PricingSection with monthly/annual plans"
```

---

## Task 8: CtaFinalSection

**Files:**
- Create: `frontend/src/components/landing/CtaFinalSection.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/CtaFinalSection.tsx
import Link from 'next/link'

export function CtaFinalSection() {
  return (
    <section
      className="border-t border-[#2a1a00] px-4 py-24 text-center sm:px-6"
      style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #0d0d0d 100%)' }}
    >
      <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
        Sua fila começa hoje.
        <br />
        <span className="text-brand-400">Grátis por 7 dias.</span>
      </h2>
      <p className="mx-auto mb-10 max-w-md text-lg text-gray-400">
        Sem cartão. Sem contrato. Sem enrolação.
      </p>
      <Link
        href="/auth/login"
        className="inline-block rounded-2xl bg-brand-600 px-10 py-5 text-xl font-black text-white transition hover:bg-brand-500"
      >
        Criar minha fila grátis →
      </Link>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/CtaFinalSection.tsx
git commit -m "feat(landing): add CtaFinalSection"
```

---

## Task 9: Footer

**Files:**
- Create: `frontend/src/components/landing/Footer.tsx`

- [ ] **Criar o componente**

```tsx
// frontend/src/components/landing/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0d0d0d] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-gray-500">
        <p>© 2026 Minha Fila · Fila virtual para restaurantes</p>
        <Link href="/auth/login" className="transition hover:text-gray-300">
          Entrar
        </Link>
      </div>
    </footer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "feat(landing): add Footer"
```

---

## Task 10: Montar page.tsx

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Substituir todo o conteúdo do arquivo**

```tsx
// frontend/src/app/page.tsx
import { NavBar } from '@/components/landing/NavBar'
import { HeroSection } from '@/components/landing/HeroSection'
import { DorSection } from '@/components/landing/DorSection'
import { SolucaoSection } from '@/components/landing/SolucaoSection'
import { DiferenciaisSection } from '@/components/landing/DiferenciaisSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { CtaFinalSection } from '@/components/landing/CtaFinalSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-white">
      <NavBar />
      <main>
        <HeroSection />
        <DorSection />
        <SolucaoSection />
        <DiferenciaisSection />
        <PricingSection />
        <CtaFinalSection />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Verificar no browser que a página carrega sem erros**

```bash
cd frontend
npm run dev
# Abrir http://localhost:3000
# Verificar: todas as seções visíveis, cores âmbar, sem erros de console
```

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(landing): wire up full redesigned landing page"
```

---

## Task 11: Push

- [ ] **Push para main (deploy automático via CI/CD)**

```bash
git push origin main
```

- [ ] **Verificar deploy em produção em `minhafila.meugarcom.app`**
