<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\OrderSequence;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function resetSequence(Company $company): JsonResponse
    {
        OrderSequence::resetFor($company->id);

        return response()->json(['ok' => true, 'current_number' => 0]);
    }
}
