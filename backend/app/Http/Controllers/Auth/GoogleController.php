<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(Request $request): JsonResponse|RedirectResponse
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', config('app.url')), '/');

        if (! $request->filled('code')) {
            if ($request->filled('token') && $request->filled('user')) {
                $frontendCallback = $frontendUrl . '/auth/google/callback?' . http_build_query([
                    'token' => (string) $request->query('token'),
                    'user' => (string) $request->query('user'),
                ]);

                return redirect()->away($frontendCallback);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Google callback inválido: parâmetro "code" ausente.',
                ], 422);
            }

            return redirect()->away($frontendUrl . '/auth/login?error=google_callback_code_missing');
        }

        $socialUser = Socialite::driver('google')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            ['name' => $socialUser->getName()],
        );

        UserProvider::firstOrCreate([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => $socialUser->getId(),
        ], [
            'created_at' => Carbon::now(),
        ]);

        if (! $user->company) {
            Company::create([
                'owner_id' => $user->id,
                'name' => $user->name . "'s Empresa",
            ]);
        }

        $token = $user->createToken('google')->plainTextToken;

        $payload = [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'company_uuid' => $user->company?->id,
            ],
        ];

        if (request()->expectsJson()) {
            return response()->json($payload);
        }

        $redirectUrl = $frontendUrl . '/auth/google/callback?' . http_build_query([
            'token' => $payload['token'],
            'user' => json_encode($payload['user']),
        ]);

        return redirect()->away($redirectUrl);
    }
}
