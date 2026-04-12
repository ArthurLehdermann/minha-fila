<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

class MonitoringController extends Controller
{
    public function queueOverview(Company $company): JsonResponse
    {
        $statusCounts = Order::query()
            ->forCompany($company->id)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $counts = collect(Order::STATUSES)
            ->mapWithKeys(fn (string $status) => [$status => (int) ($statusCounts[$status] ?? 0)]);

        $oldestWaiting = Order::query()
            ->forCompany($company->id)
            ->where('status', 'waiting')
            ->oldest('created_at')
            ->first();

        $lastHour = Carbon::now()->subHour();
        $handledLastHour = Order::query()
            ->forCompany($company->id)
            ->whereIn('status', ['ready', 'done', 'cancelled'])
            ->where('updated_at', '>=', $lastHour)
            ->count();

        return response()->json([
            'status' => 'ok',
            'service' => 'queue-monitoring',
            'company_id' => $company->id,
            'counts' => $counts,
            'totals' => [
                'active' => $counts['waiting'] + $counts['preparing'] + $counts['ready'],
                'handled_last_hour' => $handledLastHour,
            ],
            'oldest_waiting' => $oldestWaiting ? [
                'order_id' => $oldestWaiting->id,
                'number' => $oldestWaiting->number,
                'wait_seconds' => Carbon::now()->diffInSeconds($oldestWaiting->created_at),
                'created_at' => $oldestWaiting->created_at?->toIso8601String(),
            ] : null,
            'runtime' => [
                'queue_connection' => config('queue.default'),
                'queue_size' => Queue::size(),
                'time' => now()->toIso8601String(),
            ],
        ]);
    }
}
