<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSettingsController extends Controller
{
    public function updateTimezone(Request $request): JsonResponse
    {
        $data = $request->validate([
            'timezone' => ['required', 'string', 'timezone'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->update([
            'timezone' => $data['timezone'],
        ]);

        return response()->json([
            'timezone' => $user->timezone,
        ]);
    }
}
