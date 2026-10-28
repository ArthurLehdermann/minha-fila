<?php

namespace App\Services\Dodo;

use App\Models\Assinatura;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Aplica no User/Assinatura o estado de uma assinatura do Dodo recebido por webhook.
 *
 * Diferente do PromptBI (que só reescreve status), aqui o crédito de ciclo é
 * aditivo em `acesso_expira_em` — a idempotência vem do `webhook-id` único
 * (gravado antes de processar).
 */
class SubscriptionSync
{
    public function __construct(private readonly DodoClient $dodo) {}

    /**
     * @param  array<string, mixed>  $data  bloco "data" do webhook
     * @return string motivo curto para log/resposta (ok|ignored|…)
     */
    public function apply(string $eventType, array $data): string
    {
        $productId = isset($data['product_id']) && is_string($data['product_id'])
            ? $data['product_id']
            : null;

        // Business BigWorks compartilhado: eventos de outros produtos → 200 ignore.
        if ($productId !== null && ! $this->dodo->ownsProduct($productId)) {
            Log::info('Dodo webhook: produto de outro app ignorado', ['product_id' => $productId]);

            return 'ignored_product';
        }

        $subscriptionId = $data['subscription_id'] ?? null;
        if (! is_string($subscriptionId) || $subscriptionId === '') {
            return 'ignored_no_subscription';
        }

        return match ($eventType) {
            'subscription.active', 'subscription.renewed' => $this->ativarOuRenovar($subscriptionId, $data),
            'subscription.cancelled', 'subscription.expired', 'subscription.failed' => $this->cancelar($subscriptionId, $data),
            default => 'ignored_event',
        };
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function ativarOuRenovar(string $subscriptionId, array $data): string
    {
        $ciclo = $this->dodo->cicloForProduct(
            isset($data['product_id']) && is_string($data['product_id']) ? $data['product_id'] : null
        );

        if (! $ciclo) {
            // Sem product_id conhecido e sem mapeamento — não creditar.
            return 'ignored_unknown_ciclo';
        }

        DB::transaction(function () use ($subscriptionId, $data, $ciclo) {
            $user = $this->findUser($subscriptionId, $data);

            if (! $user) {
                Log::warning('Dodo webhook: assinatura sem usuário identificável', [
                    'subscription_id' => $subscriptionId,
                ]);

                return;
            }

            $user = User::whereKey($user->id)->lockForUpdate()->first();

            if (! $user) {
                return;
            }

            $assinatura = Assinatura::where('dodo_subscription_id', $subscriptionId)
                ->lockForUpdate()
                ->first();

            if (! $assinatura) {
                $assinatura = Assinatura::create([
                    'user_id' => $user->id,
                    'ciclo' => $ciclo,
                    'gateway' => Assinatura::GATEWAY_DODO,
                    'dodo_subscription_id' => $subscriptionId,
                    'dodo_customer_id' => $this->customerId($data),
                    'status' => Assinatura::STATUS_AUTORIZADA,
                ]);
            } else {
                $assinatura->fill([
                    'ciclo' => $ciclo,
                    'gateway' => Assinatura::GATEWAY_DODO,
                    'dodo_customer_id' => $this->customerId($data) ?? $assinatura->dodo_customer_id,
                    'status' => Assinatura::STATUS_AUTORIZADA,
                    'cancelada_em' => null,
                ]);
            }

            if (! empty($data['next_billing_date'])) {
                $assinatura->proxima_cobranca_em = Carbon::parse($data['next_billing_date'])
                    ->setTimezone(config('app.timezone'));
            }

            $assinatura->save();

            $base = $this->baseDeVigencia($user);
            $ate = $ciclo === 'anual' ? $base->copy()->addYear() : $base->copy()->addMonth();

            $user->acesso_expira_em = $ate;
            $user->saveQuietly();

            Log::info('Dodo: ciclo de acesso creditado', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId,
                'ciclo' => $ciclo,
                'acesso_ate' => $ate->toIso8601String(),
            ]);
        });

        return 'credited';
    }

    /**
     * Cancela a recorrência sem zerar `acesso_expira_em` — o ciclo já pago
     * continua valendo até o vencimento.
     *
     * @param  array<string, mixed>  $data
     */
    private function cancelar(string $subscriptionId, array $data): string
    {
        $assinatura = Assinatura::where('dodo_subscription_id', $subscriptionId)->first();

        if (! $assinatura) {
            // Pode ser produto nosso mas ainda sem registro local (ex.: failed antes do active).
            $user = $this->findUser($subscriptionId, $data);
            if (! $user) {
                return 'ignored_unknown_subscription';
            }

            return 'ignored_no_local_subscription';
        }

        if ($assinatura->status !== Assinatura::STATUS_CANCELADA) {
            $assinatura->update([
                'status' => Assinatura::STATUS_CANCELADA,
                'cancelada_em' => $assinatura->cancelada_em ?? now(),
            ]);
        }

        return 'cancelled';
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function findUser(string $subscriptionId, array $data): ?User
    {
        $assinatura = Assinatura::where('dodo_subscription_id', $subscriptionId)->first();
        if ($assinatura) {
            return $assinatura->user;
        }

        $userId = $data['metadata']['user_id'] ?? null;

        return is_string($userId) && $userId !== '' ? User::find($userId) : null;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function customerId(array $data): ?string
    {
        $id = $data['customer']['customer_id'] ?? null;

        return is_string($id) && $id !== '' ? $id : null;
    }

    private function baseDeVigencia(User $user): Carbon
    {
        $atual = $user->acesso_expira_em;

        if ($atual && $atual->isFuture()) {
            return $atual->copy();
        }

        if ($user->trial_ends_at && $user->trial_ends_at->isFuture()) {
            return $user->trial_ends_at->copy();
        }

        return now();
    }
}
