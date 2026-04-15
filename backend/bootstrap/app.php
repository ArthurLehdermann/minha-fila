<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'auth/magic-link',
            'auth/logout',
            'api/stripe/webhook',
        ]);

        $middleware->alias([
            'tenant.access' => \App\Http\Middleware\EnsureTenantAccess::class,
            'plan.access'   => \App\Http\Middleware\EnsurePlanAccess::class,
            'auth.cookie'   => \App\Http\Middleware\AuthenticateFromCookie::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\AuthenticateFromCookie::class,
        ]);

        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \App\Http\Middleware\AuthenticateFromCookie::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
