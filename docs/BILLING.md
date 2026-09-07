# Billing (Mercado Pago)

O Minha Fila cobra assinatura pelo Mercado Pago. Não usa Stripe nem Laravel Cashier (as migrations `subscriptions*`/`meter*` de 2026-04 são resíduo da fase Cashier e não estão em uso).

Há um único produto com dois ciclos: **mensal** e **anual**. Preço padrão R$ 9,90 e R$ 99,90, sobrescrevível por `.env` (`MP_PRECO_MENSAL`, `MP_PRECO_ANUAL`). Configuração em `config/mercadopago.php`.

## Duas formas de pagar

- **Cartão (recorrente)**: assinatura via preapproval do Mercado Pago (`AssinaturaService::iniciarCartao`). Exige o `preapproval_plan_id` do ciclo sincronizado no MP (`MP_PLAN_ID_MENSAL` / `MP_PLAN_ID_ANUAL`).
- **Pix (avulso)**: não é recorrente. Cada pagamento aprovado compra exatamente um ciclo de acesso (`AssinaturaService::iniciarPix`). O QR Code expira em `MP_PIX_EXPIRACAO_MINUTOS` (padrão 30).

O acesso vale até `users.acesso_expira_em`. `MP_CARENCIA_DIAS` (padrão 0) dá tolerância depois do vencimento antes de cortar.

## Gate de acesso

`EnsurePlanAccess` (`plan.access`) bloqueia criar empresa, criar/editar pedido e reset de sequência quando não há plano ativo. Leitura da fila pública continua liberada.

## Endpoints

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/api/billing/status` | Situação do plano do usuário e Pix pendente, se houver |
| POST | `/api/billing/checkout` | Inicia checkout; body `metodo=cartao\|pix` e `ciclo=mensal\|anual` |
| POST | `/api/billing/cancel` | Cancela a assinatura no cartão (o ciclo já pago continua até `acesso_expira_em`) |
| GET | `/api/billing/pix/{pagamento}` | Consulta e sincroniza o status de um Pix |
| POST | `/api/mercadopago/webhook` | Notificação do Mercado Pago; sem sessão e sem CSRF, autenticada pelo header `x-signature` |

## Webhook

A rota do webhook valida a autenticidade pelo header `x-signature` com `MP_WEBHOOK_SECRET` (a chave secreta do webhook em Suas integrações -> Webhooks). É por ela que o pagamento aprovado libera ou renova o acesso.

## Variáveis

`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `MP_WEBHOOK_SECRET`, `MP_PLAN_ID_MENSAL`, `MP_PLAN_ID_ANUAL`, `MP_PRECO_MENSAL`, `MP_PRECO_ANUAL`, `MP_PIX_EXPIRACAO_MINUTOS`, `MP_CARENCIA_DIAS`, `MP_CURRENCY` (BRL), `MP_SITE_ID` (MLB). Em produção usam-se as credenciais `APP_USR-*`; em homologação, `TEST-*`.
