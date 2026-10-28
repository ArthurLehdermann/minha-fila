<?php

/*
 * Dodo Payments: cobrança em dólar para quem usa o Minha Fila em inglês/espanhol.
 * O Mercado Pago continua cobrando em real (pt_BR). O business no Dodo é o
 * "BigWorks", compartilhado com PromptBI, QuoteMyDetail e ielos — por isso o
 * webhook filtra por product_id.
 */
return [

    'api_key' => env('DODO_PAYMENTS_API_KEY'),
    'webhook_secret' => env('DODO_PAYMENTS_WEBHOOK_KEY'),
    'mode' => env('DODO_PAYMENTS_MODE', 'test'),
    'base_urls' => [
        'test' => 'https://test.dodopayments.com',
        'live' => 'https://live.dodopayments.com',
    ],
    'timeout' => (int) env('DODO_PAYMENTS_TIMEOUT', 20),

    'planos' => [
        'mensal' => [
            'product_id' => env('DODO_PRODUCT_MENSAL'),
            'price_usd' => (float) env('DODO_PRICE_USD_MENSAL', 9),
        ],
        'anual' => [
            'product_id' => env('DODO_PRODUCT_ANUAL'),
            'price_usd' => (float) env('DODO_PRICE_USD_ANUAL', 90),
        ],
    ],

];
