<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMagicLinkRequest;
use App\Mail\MagicLinkMail;
use App\Models\Company;
use App\Models\MagicLink;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MagicLinkController extends Controller
{
    public function send(SendMagicLinkRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $token = Str::random(64);
        $expireMinutes = (int) config('auth.magic_link_expire_minutes', 15);

        MagicLink::create([
            'email' => $email,
            'token_hash' => MagicLink::hash($token),
            'expires_at' => Carbon::now()->addMinutes($expireMinutes),
            'created_at' => Carbon::now(),
        ]);

        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');
        $verifyUrl = $frontendUrl . '/auth/verify?token=' . $token . '&email=' . urlencode($email);

        Mail::to($email)->send(new MagicLinkMail($verifyUrl));

        return response()->json(null, 204);
    }

    public function verify(Request $request): JsonResponse
    {
        $token = $request->query('token', '');
        $email = $request->query('email', '');

        $link = MagicLink::where('email', $email)
            ->where('token_hash', MagicLink::hash($token))
            ->latest('created_at')
            ->first();

        if (! $link) {
            throw ValidationException::withMessages(['token' => 'Token inválido.']);
        }

        if ($link->isExpired()) {
            throw ValidationException::withMessages(['token' => 'Token expirado.']);
        }

        if ($link->isUsed()) {
            throw ValidationException::withMessages(['token' => 'Token já utilizado.']);
        }

        $link->markUsed();

        $user = User::firstOrCreate(
            ['email' => $email],
            ['name' => explode('@', $email)[0]],
        );

        UserProvider::firstOrCreate([
            'user_id' => $user->id,
            'provider' => 'magic',
        ], [
            'provider_id' => null,
            'created_at' => Carbon::now(),
        ]);

        if (! $user->company) {
            Company::create([
                'owner_id' => $user->id,
                'name' => $user->name . "'s Empresa",
            ]);
        }

        $apiToken = $user->createToken('magic-link')->plainTextToken;

        return response()->json([
            'token' => $apiToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'company_uuid' => $user->company?->id,
            ],
        ]);
    }
}
