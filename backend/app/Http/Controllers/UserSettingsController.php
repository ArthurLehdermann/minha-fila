<?php

namespace App\Http\Controllers;

use App\Support\Locale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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

    public function updateLocale(Request $request): JsonResponse
    {
        $data = $request->validate([
            'locale' => ['required', 'string', Rule::in(Locale::SUPPORTED)],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->update([
            'locale' => $data['locale'],
        ]);

        return response()->json([
            'locale' => $user->locale,
        ]);
    }
}
