<?php

/**
 * Mensajes de validación de las reglas usadas por la app (no es el catálogo completo de Laravel).
 */
return [
    'email' => 'El campo :attribute debe ser un correo electrónico válido.',
    'in' => 'El :attribute seleccionado no es válido.',
    'max' => [
        'numeric' => 'El campo :attribute no debe ser mayor que :max.',
        'string' => 'El campo :attribute no debe tener más de :max caracteres.',
    ],
    'required' => 'El campo :attribute es obligatorio.',
    'required_if' => 'El campo :attribute es obligatorio cuando :other es :value.',
    'string' => 'El campo :attribute debe ser una cadena de texto.',
    'timezone' => 'El campo :attribute debe ser una zona horaria válida.',

    'attributes' => [
        'email' => 'correo electrónico',
        'locale' => 'idioma',
        'timezone' => 'zona horaria',
        'name' => 'nombre',
        'label' => 'etiqueta',
        'status' => 'estado',
        'ciclo' => 'ciclo',
        'metodo' => 'método',
        'card_token_id' => 'token de tarjeta',
        'label_ready' => 'etiqueta listo',
        'label_preparing' => 'etiqueta preparando',
        'label_waiting' => 'etiqueta en espera',
    ],
];
