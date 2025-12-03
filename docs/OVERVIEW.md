# Overview

O Minha Fila é um sistema de fila virtual em tempo real para lanchonetes, creperias e pequenos fast‑foods. Substitui senhas de papel e chamadas por voz por um painel digital simples. O cliente acessa via QR code no balcão/mesa (PWA), e o estabelecimento administra pedidos e status em um painel web.

Benefícios
- Reduz desorganização e tempo de atendimento
- Melhora percepção de profissionalismo
- Não exige hardware adicional
- Mobile‑first, leve e responsivo

Diretrizes do MVP (atualizadas)
- Login por Google e Magic Link (e‑mail); unificação de contas por e‑mail (sem duplicar usuário).
- Primeiro acesso: criar empresa (UUID curto, ex.: `fk29ad`) e redirecionar para `/[uuid]/admin`.
- Rotas públicas: `/[uuid]` (fila); privadas: `/[uuid]/admin`, `/[uuid]/admin/config`.
- Status do pedido: `waiting`, `preparing`, `ready`, `done`.
- Realtime em canal `company.<uuid>` via Soketi.

Público‑alvo (exemplos)
- Lanchonetes pequenas, carrinhos e food trucks
- Operações sazonais de praia

Funcionalidades (MVP)
- Admin: criar pedidos, alterar status (aguardando → preparando → pronto → entregue), painéis de cozinha e TV
- Cliente (PWA): ver senha/status em tempo real
- Sistema: WebSockets via Soketi, cache Redis, consistência com `sequence_id`


