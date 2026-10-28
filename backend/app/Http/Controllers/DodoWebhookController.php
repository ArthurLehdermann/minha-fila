<?php

namespace App\Http\Controllers;

use App\Models\DodoWebhookEvent;
use App\Services\Dodo\SubscriptionSync;
use App\Services\Dodo\WebhookSignature;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DodoWebhookController extends Controller
{
    public function __construct(private readonly SubscriptionSync $sync) {}

    public function __invoke(Request $request): Response
    {
        $signature = new WebhookSignature(config('dodo.webhook_secret'));

        if (! $signature->isValid($request)) {
            Log::warning('Dodo webhook: assinatura inválida.');

            return response('invalid signature', 401);
        }

        $webhookId = (string) $request->header('webhook-id', '');
        if ($webhookId === '') {
            return response('missing webhook-id', 400);
        }

        $body = json_decode($request->getContent(), true);
        $type = is_array($body) ? ($body['type'] ?? null) : null;
        $data = is_array($body) && is_array($body['data'] ?? null) ? $body['data'] : [];

        if (! is_string($type) || ! str_starts_with($type, 'subscription.')) {
            return response('ignored', 200);
        }

        try {
            $duplicate = false;

            DB::transaction(function () use ($webhookId, $type, $data, &$duplicate) {
                $existing = DodoWebhookEvent::where('webhook_id', $webhookId)
                    ->lockForUpdate()
                    ->first();

                if ($existing) {
                    $duplicate = true;

                    return;
                }

                DodoWebhookEvent::create([
                    'webhook_id' => $webhookId,
                    'event_type' => $type,
                    'processed_at' => now(),
                ]);

                $this->sync->apply($type, $data);
            });

            if ($duplicate) {
                return response('ok', 200);
            }
        } catch (\Throwable $e) {
            Log::error('Dodo webhook: falha ao processar evento', [
                'type' => $type,
                'webhook_id' => $webhookId,
                'error' => $e->getMessage(),
            ]);

            // Resposta não-2xx faz o Dodo reenviar o evento.
            return response('processing error', 500);
        }

        return response('ok', 200);
    }
}
