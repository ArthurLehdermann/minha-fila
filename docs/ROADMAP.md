# Roadmap

## Entregue (sprint inicial)

1. Login Google + unificação por e-mail (`user_providers`).
2. Primeiro acesso: cria empresa (id curto) e leva ao admin.
3. API Laravel: CRUD de pedidos + reset de sequência.
4. Broadcasting via Soketi (evento `OrderUpdated`).
5. Frontend Next.js consumindo a fila em tempo real (rota pública `/fila/[uuid]`).
6. Admin para criar pedido e mudar status (waiting -> preparing -> ready -> done).
7. Deploy backend e frontend por Docker Compose na VPS (runner `minhafila-vps`), com CI.
8. Billing Mercado Pago: assinatura no cartão (preapproval) e Pix por ciclo, com gate `plan.access`.

Login por Apple estava previsto no plano original e não foi implementado.

## Pendências abertas (do TECH_AUDIT 2026-04-03)

- **#4 Realtime de criação**: o cliente só escuta `.OrderUpdated`; injetar o pedido novo no estado sem depender do refetch.
- **#6 Endpoint de monitoring público**: `GET monitoring/companies/{company}/queue` não tem auth e devolve bloco `runtime` (`queue_connection`, `queue_size`). Proteger ou remover o bloco.

## Ideias (não priorizadas)

- Relatórios: tempo médio de atendimento, volume por hora.
- Multiusuário por empresa (hoje é um dono por conta).
- Auditoria e métricas no backend.
- Teste de caminho feliz do checkout/webhook do Mercado Pago.
- Regenerar `docs/openapi/openapi.yaml` (hoje desatualizado) a partir das rotas atuais.
