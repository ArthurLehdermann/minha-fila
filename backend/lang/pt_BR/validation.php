<?php

/**
 * Mensagens de validação usadas pelas regras do app (não é o catálogo completo do Laravel).
 */
return [
    'email' => 'O campo :attribute não contém um endereço de e-mail válido.',
    'in' => 'O :attribute selecionado é inválido.',
    'max' => [
        'numeric' => 'O campo :attribute não pode ser superior a :max.',
        'string' => 'O campo :attribute não pode conter mais de :max caracteres.',
    ],
    'required' => 'O campo :attribute é obrigatório.',
    'required_if' => 'O campo :attribute é obrigatório quando :other é :value.',
    'string' => 'O campo :attribute deve ser uma string.',
    'timezone' => 'O campo :attribute deve ser um fuso horário válido.',

    'attributes' => [
        'email' => 'e-mail',
        'locale' => 'idioma',
        'timezone' => 'fuso horário',
        'name' => 'nome',
        'label' => 'rótulo',
        'status' => 'status',
        'ciclo' => 'ciclo',
        'metodo' => 'método',
        'card_token_id' => 'token do cartão',
        'label_ready' => 'rótulo pronto',
        'label_preparing' => 'rótulo preparando',
        'label_waiting' => 'rótulo aguardando',
    ],
];
