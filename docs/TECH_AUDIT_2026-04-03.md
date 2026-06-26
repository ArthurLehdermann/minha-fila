# Auditoria técnica crítica — Minha Fila (2026-04-03)

> **Atualização 2026-06-26:** revisão dos achados contra o código atual. Os 3 críticos
> (autorização, atomicidade de sequência, auth backend) foram **resolvidos**. Status
> individual marcado em cada item abaixo.

## Resumo executivo
- Estado atual: MVP funcional de fila em tempo real, com escopo estreito e execução parcialmente coerente.
- Maturidade: **beta inicial / produção precária**.
- Decisão sugerida: **continuar, sem reescrita total**; refatorar autenticação/autorização, concorrência de sequência e hardening operacional antes de vender sério.

## Achados principais
1. ✅ **RESOLVIDO — Falha crítica de autorização (IDOR/multi-tenant)**: rotas de escrita
   de pedidos e reset de sequência agora exigem `auth:sanctum` + `tenant.access`
   (`EnsureTenantAccess`) + `plan.access` (`routes/api.php:36-42`).
2. ✅ **RESOLVIDO — Contador de pedidos não-atômico**: `OrderSequence::nextFor` agora roda
   dentro de `DB::transaction` com `lockForUpdate` antes do `update` — atômico sob concorrência.
3. ✅ **RESOLVIDO — Auth no frontend é apenas UX**: o backend passou a exigir Sanctum em
   todas as rotas de escrita; a guarda do frontend deixou de ser a única camada.
4. ⚠️ **PENDENTE — Realtime incompleto**: o cliente (`frontend/src/lib/echo.ts:58`) só escuta
   `.OrderUpdated`. Pedido novo não é injetado via WebSocket — só aparece em refetch,
   podendo divergir momentaneamente do estado real.
5. **Arquitetura geral aceitável para MVP**: monólito Laravel + frontend Next separado, com Soketi/Redis e migrations/testes cobrindo fluxo base.

### Achado adicional (2026-06-26)
6. ⚠️ **PENDENTE — Endpoint de monitoring público**: `GET monitoring/companies/{company}/queue`
   (`routes/api.php:19`) não tem autenticação. Exposto apenas pelo UUID da empresa, vaza
   contagens de pedidos por status, pedido mais antigo na fila e um bloco `runtime`
   com `queue_connection`, `queue_size` e hora do servidor (`MonitoringController::queueOverview`).
   Proteger com auth ou, no mínimo, remover o bloco `runtime` da resposta pública.

## Recomendação objetiva
- Não descartar projeto.
- Pendências restantes: realtime de criação de pedido (#4) e fechar/auth o endpoint de monitoring (#6).
- Demais itens de hardening do sprint inicial (segurança + consistência de dados) já endereçados.
