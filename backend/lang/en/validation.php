<?php

/**
 * Validation messages for rules used by the app (not the full Laravel catalog).
 */
return [
    'email' => 'The :attribute field must be a valid email address.',
    'in' => 'The selected :attribute is invalid.',
    'max' => [
        'numeric' => 'The :attribute field must not be greater than :max.',
        'string' => 'The :attribute field must not be greater than :max characters.',
    ],
    'required' => 'The :attribute field is required.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'string' => 'The :attribute field must be a string.',
    'timezone' => 'The :attribute field must be a valid timezone.',

    'attributes' => [
        'email' => 'email',
        'locale' => 'language',
        'timezone' => 'timezone',
        'name' => 'name',
        'label' => 'label',
        'status' => 'status',
        'ciclo' => 'billing cycle',
        'metodo' => 'payment method',
        'card_token_id' => 'card token',
        'label_ready' => 'ready label',
        'label_preparing' => 'preparing label',
        'label_waiting' => 'waiting label',
    ],
];
