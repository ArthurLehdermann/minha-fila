<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlanAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->emTrial() || $user->acessoPago()) {
            return $next($request);
        }

        return response()->json([
            'message'     => 'Assine um plano para continuar.',
            'plan_status' => 'blocked',
        ], 402);
    }
}
