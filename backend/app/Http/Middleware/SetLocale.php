<?php

namespace App\Http\Middleware;

use App\Support\Locale;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Define App::setLocale() para API/web.
 *
 * Ordem: users.locale (autenticado) → header/param do frontend → Accept-Language → pt_BR.
 *
 * Resolve o usuário Sanctum cedo: o middleware de rota `auth:sanctum` roda
 * depois deste append global, então `$request->user()` ainda pode ser null.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user() ?? Auth::guard('sanctum')->user();
        $userLocale = Locale::normalize($user?->locale);

        $locale = $userLocale
            ?? Locale::normalize($request->input('locale'))
            ?? Locale::normalize($request->input('lang'))
            ?? Locale::normalize($request->query('locale'))
            ?? Locale::normalize($request->query('lang'))
            ?? Locale::normalize($request->header('X-Locale'))
            ?? Locale::fromAcceptLanguage($request)
            ?? Locale::DEFAULT;

        App::setLocale($locale);

        return $next($request);
    }
}
