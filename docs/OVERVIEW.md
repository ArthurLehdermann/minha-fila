# Visão do Produto - Minha Fila

O Minha Fila organiza filas de atendimento em pequenos negócios sem senha de papel: o cliente lê um QR Code e acompanha a posição pelo próprio celular, enquanto o balcão gerencia os pedidos por um painel. É uma plataforma multi-empresa, então um mesmo dono opera várias filas a partir de um login só.

## Público-alvo

- Food trucks e carrinhos: sem hardware, funciona no navegador.
- Creperias e lanchonetes: chamada de pedido por número ou nome.
- Eventos sazonais: setup rápido em feira, praia e festival.

Esse é o público que o produto atende hoje. Não há, por ora, integração com PDV, impressora fiscal ou totem físico.

## Conceitos

1. **Multi-empresa (multi-tenant)**: cada usuário pode ter várias empresas ("Filas"). Cada empresa tem seus próprios pedidos, sequência e configuração. O isolamento é por `company_id`/UUID e imposto no backend pelo middleware `EnsureTenantAccess`.
2. **Domínio unificado**: tudo em `https://minhafila.meugarcom.app`, com roteamento por caminho no Traefik:
   - `/`: landing e portal.
   - `/api/*`, `/auth/google/*`, `/auth/magic-link/*`, `/sanctum/*`, `/storage/*`: backend Laravel.
   - `/app/*`: WebSocket (Soketi).
   - demais rotas: frontend Next.js (dashboard, admin da fila e link público do cliente).

## Funcionalidades atuais

- Criação rápida de pedido com label (nome ou número).
- Status waiting -> preparing -> ready -> done, com retrocesso.
- Painel em tempo real para tablet, monitor ou TV.
- Reinício da sequência de senhas por empresa.
- Configuração de nome e labels da empresa.
- Login por Google e Magic Link.
- Assinatura mensal/anual pelo Mercado Pago; sem plano ativo, a criação de empresa/pedido é bloqueada pelo `EnsurePlanAccess`.

## Fora de escopo hoje

Apple Sign-in, app nativo, relatórios e métricas de tempo médio, multiusuário por empresa e auditoria ainda não existem. Estão no [ROADMAP](ROADMAP.md) como ideias, não como entregas.

---

Este documento é a referência de propósito do produto. Detalhe técnico está em [ARCHITECTURE](ARCHITECTURE.md).
