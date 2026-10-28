# Billing (Mercado Pago e Dodo)

O Minha Fila cobra assinatura de duas formas, conforme o idioma do usuário:

| Locale | Gateway | Moeda | Fluxos |
|--------|---------|-------|--------|
| `pt_BR` | Mercado Pago | BRL | Cartão recorrente (preapproval) e Pix avulso por ciclo |
| `en` / `es` | Dodo Payments | USD | Checkout hospedado (assinatura mensal ou anual) |

Não usa Stripe nem Laravel Cashier (as migrations `subscriptions*`/`meter*` de 2026-04 são resíduo da fase Cashier e não estão em uso).

Há um único produto com dois ciclos: **mensal** e **anual**.

- **Mercado Pago:** preço padrão R$ 9,90 e R$ 99,90 (`MP_PRECO_MENSAL`, `MP_PRECO_ANUAL`). Configuração em `config/mercadopago.php`.
- **Dodo:** US$ 9 e US$ 90 (`DODO_PRICE_USD_MENSAL` / `DODO_PRICE_USD_ANUAL`, padrão 9/90). Produtos e chave em `config/dodo.php`.

O business Dodo **BigWorks** é compartilhado com PromptBI, QuoteMyDetail e ielos. O webhook **filtra por `product_id`**: eventos de outros produtos são ignorados com HTTP 200.

## Mercado Pago (pt_BR)

- **Cartão (recorrente)**: assinatura via preapproval (`AssinaturaService::iniciarCartao`). Exige o `preapproval_plan_id` do ciclo (`MP_PLAN_ID_MENSAL` / `MP_PLAN_ID_ANUAL`).
- **Pix (avulso)**: não é recorrente. Cada pagamento aprovado compra exatamente um ciclo (`AssinaturaService::iniciarPix`). O QR Code expira em `MP_PIX_EXPIRACAO_MINUTOS` (padrão 30).

## Dodo Payments (en/es)

- Checkout hospedado (`POST /checkouts` na API do Dodo) com e-mail do usuário, `metadata.user_id` e `return_url` para `/billing`.
- Produtos: `DODO_PRODUCT_MENSAL` e `DODO_PRODUCT_ANUAL`.
- O front em en/es esconde Pix/cartão MP e mostra preços em USD + CTA que chama `metodo=dodo`.

É possível forçar o gateway no checkout com `metodo=dodo|cartao|pix` (útil em testes). Sem `metodo`, o backend escolhe pelo `users.locale` (`GatewayResolver`).

## Acesso

O acesso vale até `users.acesso_expira_em`. `MP_CARENCIA_DIAS` (padrão 0) dá tolerância depois do vencimento antes de cortar. Cancelar assinatura (MP ou Dodo) **não** zera a vigência — o ciclo já pago continua até o fim.

## Gate de acesso

`EnsurePlanAccess` (`plan.access`) bloqueia criar empresa, criar/editar pedido e reset de sequência quando não há plano ativo. Leitura da fila pública continua liberada.

## Endpoints

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/api/billing/status` | Situação do plano, gateway preferido, assinatura recorrente e Pix pendente |
| POST | `/api/billing/checkout` | Inicia checkout; body `metodo=cartao\|pix\|dodo` (opcional) e `ciclo=mensal\|anual` |
| POST | `/api/billing/cancel` | Cancela recorrência MP ou Dodo (ciclo pago segue até `acesso_expira_em`) |
| GET | `/api/billing/pix/{pagamento}` | Consulta e sincroniza o status de um Pix |
| POST | `/api/mercadopago/webhook` | Notificação do Mercado Pago; autenticada pelo header `x-signature` |
| POST | `/api/dodo/webhook` | Notificação do Dodo; Standard Webhooks (`webhook-id` / `webhook-timestamp` / `webhook-signature`) |

## Webhook Dodo

- Sem sessão e sem CSRF. Assinatura conferida com `DODO_PAYMENTS_WEBHOOK_KEY`.
- Idempotente por `webhook-id` (tabela `dodo_webhook_events`).
- **Filtro `product_id`:** só processa produtos em `DODO_PRODUCT_MENSAL` / `DODO_PRODUCT_ANUAL`.
- Eventos tratados:
  - `subscription.active` / `subscription.renewed` → upsert assinatura `gateway=dodo` e credita um ciclo em `acesso_expira_em` (mesma regra `baseDeVigencia` do MP).
  - `subscription.cancelled` / `expired` / `failed` → marca assinatura cancelada **sem** zerar `acesso_expira_em`.

## Variáveis

**Mercado Pago:** `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `MP_WEBHOOK_SECRET`, `MP_PLAN_ID_MENSAL`, `MP_PLAN_ID_ANUAL`, `MP_PRECO_MENSAL`, `MP_PRECO_ANUAL`, `MP_PIX_EXPIRACAO_MINUTOS`, `MP_CARENCIA_DIAS`, `MP_CURRENCY` (BRL), `MP_SITE_ID` (MLB).

**Dodo:** `DODO_PAYMENTS_MODE` (`test`/`live`), `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_KEY`, `DODO_PRODUCT_MENSAL`, `DODO_PRODUCT_ANUAL`. Opcionais: `DODO_PRICE_USD_MENSAL`, `DODO_PRICE_USD_ANUAL`, `DODO_PAYMENTS_TIMEOUT`.

Nenhum segredo entra no repositório — só os nomes das variáveis em `.env.example`. Em produção as credenciais ficam no Vault / `.env.prod` fora do clone.
