<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
	return response()->json([
		'status' => 'ok',
		'service' => 'minha-fila-backend',
		'time' => now()->toIso8601String(),
	]);
});


