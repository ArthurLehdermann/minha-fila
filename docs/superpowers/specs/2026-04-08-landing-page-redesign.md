# Redesign da Landing Page — Minha Fila

**Data:** 2026-04-08  
**Status:** Aprovado para implementação

---

## Objetivo

Substituir a landing page atual (técnica, focada em features) por uma página de conversão focada em dor e benefício, direcionada a operadores de restaurantes, foodcourts e eventos.

---

## Identidade Visual

| Atributo | Atual | Novo |
|---|---|---|
| Cor primária | Cyan/violeta | Âmbar (`#f59e0b` / `#d97706`) |
| Background | `slate-950` | `#0d0d0d` / `#111` / `#161616` |
| Tom | Técnico/premium | Direto/agressivo/honesto |
| Badge do hero | "Moderno, fluido e mobile first" | "🔥 Fila virtual para restaurantes" |

---

## Estrutura de Seções

### 1. NavBar
- Logo "Minha Fila" (letra M âmbar, sem gradiente cyan)
- Links: "Entrar" + "Criar minha fila grátis" (botão âmbar)

### 2. Hero
- Badge: `🔥 Fila virtual para restaurantes`
- H1: **"Chega de fila bagunçada no seu atendimento."** (destaque âmbar na segunda linha)
- Sub: "Organize os pedidos, elimine a confusão e atenda mais rápido. Tudo pelo celular, sem instalar nada."
- CTA primário: **"Criar minha fila grátis →"**
- CTA secundário: "Ver como funciona" (scroll anchor)
- Micro-copy: "7 dias grátis · Sem cartão de crédito"
- Visual: mockup de tela do produto (phone frame mostrando a fila em tempo real)

### 3. Bloco de Dor ("Parece familiar?")
4 cards com dores reais:
- 😤 "Já tá pronto?" — cliente pergunta pela quinta vez
- 😵 Pedido entregue errado porque a fila era só na cabeça do operador
- 😠 Cliente que chegou depois recebeu antes. Reclamação na hora.
- 📢 Gritando nome no salão cheio...

### 4. Solução ("Fila inteligente, atendimento tranquilo")
3 cards de solução (ícones âmbar):
1. **Cliente lê o QR Code** — Na mesa ou balcão. Sem app para instalar.
2. **Entra na fila automaticamente** — Situação dos pedidos em tempo real.
3. **Chamado quando ficar pronto** — Notificação no celular. Sem grito, sem confusão.

### 5. Diferenciais ("Sem complicação, sem desculpa")
3 itens em texto grande âmbar:
- **Sem app** — O cliente usa pelo navegador. Zero instalação.
- **Sem hardware** — Sem totem, sem senha física, sem equipamento.
- **5 minutos** — Da conta criada até a primeira fila funcionando.

### 6. Pricing ("Simples assim")
2 cards:
- **Mensal:** R$ 9,90/mês — Cancele quando quiser
- **Anual:** R$ 99,90/ano — Mais vendido *(destaque âmbar, badge "MELHOR VALOR")*

Micro-copy: "7 dias grátis em qualquer plano. Sem cartão de crédito."

### 7. CTA Final
- H2: "Sua fila começa hoje. **Grátis por 7 dias.**"
- Sub: "Sem cartão. Sem contrato. Sem enrolação."
- CTA: "Criar minha fila grátis →"

### 8. Footer
- © 2026 Minha Fila · Fila virtual para restaurantes
- Link "Entrar"

---

## Arquitetura de Componentes

```
frontend/src/app/page.tsx              ← orquestrador (importa seções)
frontend/src/components/landing/
  NavBar.tsx
  HeroSection.tsx
  DorSection.tsx
  SolucaoSection.tsx
  DiferenciaisSection.tsx
  PricingSection.tsx
  CtaFinalSection.tsx
  Footer.tsx
```

---

## Decisões Técnicas

- **Sem prova social fake:** não usar depoimentos, números de clientes ou uptime inventados
- **Prova via produto:** mockup de tela real da fila no hero (SVG ou screenshot estilizado)
- **Cores:** remover cyan/violeta completamente; usar âmbar em todos os destaques
- **'use client' apenas onde necessário:** HeroSection pode ser server component; seções estáticas não precisam de client
- **Scroll anchor:** CTA "Ver como funciona" rola até `#como-funciona` (id na SolucaoSection)
- **Fonte:** mantém Inter (já configurada no projeto)

---

## O que NÃO fazer

- Não inventar números ("200+ estabelecimentos", "99.9% uptime", "30% mais rápido")
- Não usar depoimentos fabricados
- Não manter as cores cyan/azul da versão atual em lugar nenhum
- Não criar página separada — tudo em `page.tsx` + componentes em `/landing/`
