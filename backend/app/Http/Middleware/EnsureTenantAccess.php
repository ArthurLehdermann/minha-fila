<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Models\Order;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        /** @var Company|string|null $company */
        $company = $request->route('company');
        /** @var Order|string|null $order */
        $order = $request->route('order');

        // Resolve company ID
        $companyId = $company instanceof Company ? $company->id : $company;

        // If we have an order, ensure it belongs to a company the user owns
        if ($order instanceof Order) {
            $companyId = $order->company_id;
        }

        if (!$companyId || !$user->companies()->where('id', $companyId)->exists()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
