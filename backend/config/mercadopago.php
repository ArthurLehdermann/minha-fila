<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Credenciais
    |--------------------------------------------------------------------------
    |
    | Access token e public key da aplicação do Mercado Pago. Em produção são
    | as credenciais APP_USR-*; em homologação, as TEST-*. O webhook_secret é
    | a "chave secreta" configurada em Suas integrações → Webhooks, usada para
    | validar o header x-signature das notificações.
    |
    */

    'access_token'   => env('MP_ACCESS_TOKEN'),
    'public_key'     => env('MP_PUBLIC_KEY'),
    'webhook_secret' => env('MP_WEBHOOK_SECRET'),

    'base_url' => env('MP_BASE_URL', 'https://api.mercadopago.com'),

    'timeout' => (int) env('MP_TIMEOUT', 20),

    /*
    |--------------------------------------------------------------------------
    | Moeda e país
    |--------------------------------------------------------------------------
    */

    'currency' => env('MP_CURRENCY', 'BRL'),
    'site_id'  => env('MP_SITE_ID', 'MLB'),

    /*
    |--------------------------------------------------------------------------
    | Planos (preço fixo, sem tabela de planos)
    |--------------------------------------------------------------------------
    |
    | Minha Fila tem um único produto com dois ciclos. O id do preapproval_plan
    | criado no Mercado Pago fica gravado aqui depois do `mp:sincronizar-planos`
    | (via .env, igual ao restante das credenciais).
    |
    */

    'planos' => [
        'mensal' => [
            'preco'                 => (float) env('MP_PRECO_MENSAL', 9.90),
            'preapproval_plan_id'   => env('MP_PLAN_ID_MENSAL'),
        ],
        'anual' => [
            'preco'                 => (float) env('MP_PRECO_ANUAL', 99.90),
            'preapproval_plan_id'   => env('MP_PLAN_ID_ANUAL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pix
    |--------------------------------------------------------------------------
    |
    | Pix não é recorrente: cada pagamento aprovado compra um ciclo de acesso.
    | expiracao_minutos controla até quando o QR code aceita pagamento.
    |
    */

    'pix' => [
        'expiracao_minutos' => (int) env('MP_PIX_EXPIRACAO_MINUTOS', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Vigência
    |--------------------------------------------------------------------------
    |
    | Dias de tolerância após o fim do ciclo antes de cortar o acesso. Serve
    | para absorver atraso de compensação e retentativa de cobrança do cartão.
    | Zero = corta no vencimento.
    |
    */

    'carencia_dias' => (int) env('MP_CARENCIA_DIAS', 0),

];
