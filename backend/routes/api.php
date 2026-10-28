<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DodoWebhookController;
use App\Http\Controllers\MercadoPagoWebhookController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserSettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'minha-fila-backend',
        'time' => now()->toIso8601String(),
    ]);
});

Route::get('monitoring/companies/{company}/queue', [MonitoringController::class, 'queueOverview']);

// Companies Management
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('companies', [CompanyController::class, 'index']);
    Route::post('companies', [CompanyController::class, 'store'])->middleware('plan.access');
    Route::delete('companies/{company}', [CompanyController::class, 'destroy'])->middleware(['tenant.access', 'plan.access']);
    Route::patch('companies/{company}/status', [CompanyController::class, 'toggleStatus'])->middleware(['tenant.access', 'plan.access']);
    Route::patch('companies/{company}/labels', [CompanyController::class, 'updateLabels'])->middleware(['tenant.access']);
    Route::patch('companies/{company}/name', [CompanyController::class, 'updateName'])->middleware(['tenant.access']);
});

// Companies & Orders (Public & Tenant Access)
Route::prefix('companies/{company}')->group(function () {
    Route::get('/', [CompanyController::class, 'show']);
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/changes', [OrderController::class, 'changes']);
    Route::middleware(['auth:sanctum', 'tenant.access', 'plan.access'])->group(function () {
        Route::post('orders', [OrderController::class, 'store'])->middleware('throttle:30,1');
        Route::post('reset-sequence', [CompanyController::class, 'resetSequence']);
    });
});

Route::middleware(['auth:sanctum', 'tenant.access', 'plan.access'])->patch('orders/{order}', [OrderController::class, 'update']);

// Billing
Route::middleware(['auth:sanctum'])->prefix('billing')->group(function () {
    Route::get('status', [BillingController::class, 'status']);
    Route::post('checkout', [BillingController::class, 'checkout']);
    Route::post('cancel', [BillingController::class, 'cancel']);
    Route::get('pix/{pagamento}', [BillingController::class, 'pixStatus']);
});

Route::middleware(['auth:sanctum'])->patch('user/timezone', [UserSettingsController::class, 'updateTimezone']);
Route::middleware(['auth:sanctum'])->patch('user/locale', [UserSettingsController::class, 'updateLocale']);

// Notificação do Mercado Pago: sem sessão, sem CSRF, sem gate de assinatura.
// A autenticidade vem do header x-signature.
Route::post('mercadopago/webhook', MercadoPagoWebhookController::class)
    ->name('mercadopago.webhook');

// Notificação do Dodo Payments: sem sessão, sem CSRF. Autenticidade via
// Standard Webhooks (webhook-id / webhook-timestamp / webhook-signature).
Route::post('dodo/webhook', DodoWebhookController::class)
    ->name('dodo.webhook');
