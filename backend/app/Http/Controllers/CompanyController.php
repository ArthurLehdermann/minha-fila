<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\OrderSequence;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(): JsonResponse
    {
        $companies = auth()->user()->companies()->latest()->get();

        return response()->json($companies);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = auth()->user();
        $totalCount  = $user->companies()->count();
        $activeCount = $user->companies()->where('status', 'active')->count();

        if ($totalCount >= 10) {
            return response()->json(['message' => 'Limite de 10 filas atingido.'], 422);
        }

        if ($activeCount >= 5) {
            return response()->json(['message' => 'Limite de 5 filas ativas atingido.'], 422);
        }

        $company = $user->companies()->create([
            'name' => $request->name,
        ]);

        return response()->json($company, 201);
    }

    public function toggleStatus(Company $company): JsonResponse
    {
        if ($company->status === 'inactive') {
            $activeCount = auth()->user()->companies()->where('status', 'active')->count();
            if ($activeCount >= 5) {
                return response()->json(['message' => 'Limite de 5 filas ativas atingido.'], 422);
            }
        }

        $company->update(['status' => $company->status === 'active' ? 'inactive' : 'active']);

        return response()->json($company);
    }

    public function destroy(Company $company): JsonResponse
    {
        $company->delete();

        return response()->json(null, 204);
    }

    public function resetSequence(Company $company): JsonResponse
    {
        $company->orders()->delete();
        OrderSequence::resetFor($company->id);

        return response()->json(['ok' => true, 'current_number' => 0]);
    }
}
