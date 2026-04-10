<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\WebhookController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'minha-fila-backend',
        'time' => now()->toIso8601String(),
    ]);
});

// Companies Management
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('companies', [CompanyController::class, 'index']);
    Route::post('companies', [CompanyController::class, 'store'])->middleware('plan.access');
    Route::delete('companies/{company}', [CompanyController::class, 'destroy'])->middleware(['tenant.access', 'plan.access']);
    Route::patch('companies/{company}/status', [CompanyController::class, 'toggleStatus'])->middleware(['tenant.access', 'plan.access']);
    Route::patch('companies/{company}/labels', [CompanyController::class, 'updateLabels'])->middleware(['tenant.access']);
});

// Companies & Orders (Public & Tenant Access)
Route::prefix('companies/{company}')->group(function () {
    Route::get('/', [CompanyController::class, 'show']);
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/changes', [OrderController::class, 'changes']);
    Route::middleware(['auth:sanctum', 'tenant.access', 'plan.access'])->group(function () {
        Route::post('orders', [OrderController::class, 'store']);
        Route::post('reset-sequence', [CompanyController::class, 'resetSequence']);
    });
});

Route::middleware(['auth:sanctum', 'tenant.access', 'plan.access'])->patch('orders/{order}', [OrderController::class, 'update']);

// Billing
Route::middleware(['auth:sanctum'])->prefix('billing')->group(function () {
    Route::get('status', [BillingController::class, 'status']);
    Route::post('checkout', [BillingController::class, 'checkout']);
    Route::post('portal', [BillingController::class, 'portal']);
});

Route::post('stripe/webhook', [WebhookController::class, 'handleWebhook']);
