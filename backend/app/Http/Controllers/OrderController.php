<?php

namespace App\Http\Controllers;

use App\Events\OrderUpdated;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Company;
use App\Models\Order;
use App\Models\OrderSequence;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Company $company): JsonResponse
    {
        $orders = $company->orders()->orderBy('number')->get();

        return response()->json(OrderResource::collection($orders)->resolve());
    }

    public function store(StoreOrderRequest $request, Company $company): JsonResponse
    {
        $seq = OrderSequence::nextFor($company->id);

        $order = $company->orders()->create([
            'label' => $request->validated('label'),
            'number' => $seq['number'],
            'status' => 'waiting',
            'sequence_id' => $seq['sequence_id'],
        ]);

        event(new OrderUpdated($order));

        return response()->json(
            (new OrderResource($order))->resolve(),
            201,
        );
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $newSeqId = OrderSequence::nextSequenceIdFor($order->company_id);

        $order->update([
            'status' => $request->validated('status'),
            'sequence_id' => $newSeqId,
        ]);

        event(new OrderUpdated($order->fresh()));

        return response()->json((new OrderResource($order->fresh()))->resolve());
    }

    public function changes(Request $request, Company $company): JsonResponse
    {
        $since = (int) $request->query('since', 0);

        $orders = $company->orders()
            ->since($since)
            ->orderBy('sequence_id')
            ->get();

        return response()->json(OrderResource::collection($orders)->resolve());
    }
}
