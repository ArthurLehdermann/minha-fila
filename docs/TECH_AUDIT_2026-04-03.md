# Auditoria técnica crítica — Minha Fila (2026-04-03)

## Resumo executivo
- Estado atual: MVP funcional de fila em tempo real, com escopo estreito e execução parcialmente coerente.
- Maturidade: **beta inicial / produção precária**.
- Decisão sugerida: **continuar, sem reescrita total**; refatorar autenticação/autorização, concorrência de sequência e hardening operacional antes de vender sério.

## Achados principais
1. **Falha crítica de autorização (IDOR/multi-tenant)**: endpoints de pedidos e reset de sequência não estão protegidos por autenticação/autorização no backend.
2. **Contador de pedidos não-atômico**: `OrderSequence::nextFor` usa `update` seguido de `select lockForUpdate` fora de transação explícita; pode quebrar ordenação sob concorrência.
3. **Auth no frontend é apenas UX**: guarda em localStorage e redireciona na UI, mas backend aceita chamadas sem token para rotas sensíveis.
4. **Realtime incompleto**: cliente recebe evento e apenas atualiza pedido existente; não trata criação nova via WebSocket, podendo divergir do estado real.
5. **Arquitetura geral aceitável para MVP**: monólito Laravel + frontend Next separado, com Soketi/Redis e migrations/testes cobrindo fluxo base.

## Recomendação objetiva
- Não descartar projeto.
- Fazer sprint de hardening (segurança + consistência de dados + observabilidade) antes de escalar usuários pagantes.
