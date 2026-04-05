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

        $company = auth()->user()->companies()->create([
            'name' => $request->name,
        ]);

        return response()->json($company, 201);
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
