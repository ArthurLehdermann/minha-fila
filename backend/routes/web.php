<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\MagicLinkController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Auth routes (outside /api prefix)
Route::prefix('auth')->group(function () {
    Route::get('google/redirect', [GoogleController::class, 'redirect']);
    Route::get('google/callback', [GoogleController::class, 'callback']);
    Route::post('magic-link', [MagicLinkController::class, 'send']);
    Route::get('magic-link/verify', [MagicLinkController::class, 'verify']);
});
