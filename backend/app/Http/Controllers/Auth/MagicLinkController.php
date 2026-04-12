<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMagicLinkRequest;
use App\Mail\MagicLinkMail;
use App\Models\MagicLink;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MagicLinkController extends Controller
{
    private function authCookieDomain(Request $request): ?string
    {
        $explicitDomain = trim((string) env('AUTH_COOKIE_DOMAIN', ''));
        if ($explicitDomain !== '') {
            return '.' . ltrim(strtolower($explicitDomain), '.');
        }

        $requestHost = strtolower($request->getHost());
        if ($requestHost === 'localhost' || filter_var($requestHost, FILTER_VALIDATE_IP)) {
            return null;
        }

        $segments = explode('.', $requestHost);
        if (count($segments) >= 2) {
            $apexDomain = implode('.', array_slice($segments, -2));

            return '.' . $apexDomain;
        }

        return null;
    }

    private function authCookieSecure(Request $request): bool
    {
        return (bool) config('session.secure', $request->isSecure());
    }

    private function authCookieSameSite(): ?string
    {
        $sameSite = config('session.same_site', 'lax');

        return is_string($sameSite) ? strtolower($sameSite) : null;
    }

    public function send(SendMagicLinkRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $throttleKey = 'magic-link:' . sha1(strtolower($email) . '|' . $request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response()->json([
                'message' => 'Muitas tentativas. Aguarde antes de solicitar novo link.',
            ], 429);
        }
        RateLimiter::hit($throttleKey, 60);

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

        if (! $link->consume()) {
            throw ValidationException::withMessages(['token' => 'Token já utilizado ou expirado.']);
        }

        $isNew = ! User::where('email', $email)->exists();

        $user = User::firstOrCreate(
            ['email' => $email],
            ['name' => explode('@', $email)[0]],
        );

        if ($isNew) {
            $user->trial_ends_at = Carbon::now()->addDays(30);
            $user->save();
        }

        UserProvider::firstOrCreate([
            'user_id' => $user->id,
            'provider' => 'magic',
        ], [
            'provider_id' => null,
            'created_at' => Carbon::now(),
        ]);

        $apiToken = $user->createToken('magic-link')->plainTextToken;

        return response()->json([
            'token' => $apiToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'timezone' => $user->timezone,
            ],
        ])->cookie(
            'auth_token',
            $apiToken,
            10080,
            '/',
            $this->authCookieDomain($request),
            $this->authCookieSecure($request),
            true,
            false,
            $this->authCookieSameSite(),
        );
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent()
            ->withoutCookie(
                'auth_token',
                '/',
                $this->authCookieDomain($request),
                $this->authCookieSecure($request),
                true,
                false,
                $this->authCookieSameSite(),
            );
    }
}
