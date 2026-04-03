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
        $userCompanyId = $request->user()?->company?->id;

        if (! $userCompanyId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        /** @var Company|string|null $company */
        $company = $request->route('company');
        /** @var Order|string|null $order */
        $order = $request->route('order');

        if ($company instanceof Company && $company->id !== $userCompanyId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($order instanceof Order && $order->company_id !== $userCompanyId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
