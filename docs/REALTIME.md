# Realtime

Broadcast do Laravel para o frontend via Soketi (compatível com Pusher).

## Canal

- `company.{uuid}` - um canal por empresa, para não vazar evento entre filas.

## Evento

- `OrderUpdated` (`app/Events/OrderUpdated.php`, `broadcastAs = 'OrderUpdated'`).
- Disparado tanto na criação (`OrderController::store`) quanto na atualização (`update`) de pedido. Não há evento `OrderCreated` separado.

Payload (exemplo):
```json
{
  "id": 10,
  "status": "ready",
  "sequence_id": 124,
  "updated_at": "2026-09-07 14:33"
}
```

## Cliente (Echo)

- `frontend/src/lib/echo.ts` conecta no Soketi com as chaves `NEXT_PUBLIC_PUSHER_*` e escuta `.OrderUpdated` no canal da empresa.
- Ao receber o evento, revalida a lista pela API.
- **Pendência conhecida (#4 do TECH_AUDIT)**: o cliente só reage a `.OrderUpdated`; um pedido novo pode só aparecer no refetch seguinte, divergindo por um instante do estado real. O rota `orders/changes` serve de fallback por polling.

## Servidor (Laravel)

- `broadcast(new OrderUpdated($order))` roda após persistir o pedido.
- Rota do WebSocket exposta pelo Traefik em `/app` (prioridade acima do frontend).
