<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function status(): JsonResponse
    {
        $user = auth()->user();
        $subscription = $user->subscription('default');
        $subscribed = $user->subscribed('default');
        $onGracePeriod = $subscription?->onGracePeriod() ?? false;
        $isPastDue = $subscription?->stripe_status === 'past_due';

        $planStatus = match (true) {
            $subscribed && ! $isPastDue && ! $onGracePeriod => 'active',
            $subscribed && $onGracePeriod                   => 'grace',
            $user->onTrial()                                => 'trial',
            default                                         => 'blocked',
        };

        $stripeSubscription = $subscription?->asStripeSubscription();

        return response()->json([
            'plan_status'          => $planStatus,
            'trial_ends_at'        => $user->trial_ends_at?->toIso8601String(),
            'renews_at'            => $stripeSubscription?->current_period_end
                ? \Illuminate\Support\Carbon::createFromTimestamp($stripeSubscription->current_period_end)->toIso8601String()
                : null,
            'stripe_status'        => $subscription?->stripe_status,
            'cancel_at_period_end' => $stripeSubscription?->cancel_at_period_end ?? false,
        ]);
    }

    public function checkout(Request $request): JsonResponse
    {
        $request->validate(['plan' => 'required|in:monthly,yearly']);

        $user = auth()->user();
        $priceId = $request->plan === 'yearly'
            ? config('services.stripe.yearly_price_id')
            : config('services.stripe.monthly_price_id');

        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');

        $url = $user->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => $frontendUrl . '/filas?checkout=success',
                'cancel_url'  => $frontendUrl . '/billing?checkout=cancelled',
            ])->url;

        return response()->json(['url' => $url]);
    }

    public function cancel(): JsonResponse
    {
        $user = auth()->user();
        $subscription = $user->subscription('default');

        if (! $subscription || ! $subscription->active()) {
            return response()->json(['message' => 'Sem assinatura ativa.'], 422);
        }

        $subscription->cancel();

        return response()->json(['ok' => true]);
    }

    public function resume(): JsonResponse
    {
        $user = auth()->user();
        $subscription = $user->subscription('default');

        if (! $subscription || ! $subscription->onGracePeriod()) {
            return response()->json(['message' => 'Nenhuma assinatura para reativar.'], 422);
        }

        $subscription->resume();

        return response()->json(['ok' => true]);
    }

    public function portal(): JsonResponse
    {
        $user = auth()->user();
        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');

        $url = $user->billingPortalUrl($frontendUrl . '/billing');

        return response()->json(['url' => $url]);
    }
}
