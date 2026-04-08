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

        $subscription = $user->subscription('default');
        $subscribed    = $user->subscribed('default');
        $isPastDue     = $subscription?->stripe_status === 'past_due';
        $pastDueGrace  = $isPastDue
            && $subscription->updated_at->diffInDays(now()) < 3;

        $hasAccess = $user->onTrial()
            || ($subscribed && ! $isPastDue)
            || ($subscription?->onGracePeriod() ?? false)
            || $pastDueGrace;

        if (! $hasAccess) {
            return response()->json([
                'message'     => 'Assine um plano para continuar.',
                'plan_status' => 'blocked',
            ], 402);
        }

        return $next($request);
    }
}
