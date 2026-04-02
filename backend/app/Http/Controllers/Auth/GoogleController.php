<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(): JsonResponse
    {
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

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'company_uuid' => $user->company?->id,
            ],
        ]);
    }
}
