<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'minha-fila-backend',
        'time' => now()->toIso8601String(),
    ]);
});

// Companies & Orders
Route::prefix('companies/{company}')->group(function () {
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/changes', [OrderController::class, 'changes']);
    Route::middleware(['auth:sanctum', 'tenant.access'])->group(function () {
        Route::post('orders', [OrderController::class, 'store']);
        Route::post('reset-sequence', [CompanyController::class, 'resetSequence']);
    });
});

Route::middleware(['auth:sanctum', 'tenant.access'])->patch('orders/{order}', [OrderController::class, 'update']);
