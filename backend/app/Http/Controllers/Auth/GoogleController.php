<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Js;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    private function authCookieDomain(Request $request): ?string
    {
        $explicitDomain = trim((string) env('AUTH_COOKIE_DOMAIN', ''));
        if ($explicitDomain !== '') {
            return '.' . ltrim(strtolower($explicitDomain), '.');
        }

        $sessionDomain = trim((string) config('session.domain', ''));
        if ($sessionDomain !== '' && strtolower($sessionDomain) !== 'null') {
            return '.' . ltrim(strtolower($sessionDomain), '.');
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

    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(Request $request): JsonResponse|RedirectResponse|Response
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', config('app.url')), '/');

        if (! $request->filled('code')) {
            if ($request->filled('token') && $request->filled('user')) {
                $alreadyRedirected = $request->cookie('oauth_google_callback_redirected') === '1';
                $frontendScheme = (string) parse_url($frontendUrl, PHP_URL_SCHEME);
                $frontendHost = (string) parse_url($frontendUrl, PHP_URL_HOST);
                $frontendPort = parse_url($frontendUrl, PHP_URL_PORT);
                $frontendOrigin = $frontendScheme . '://' . $frontendHost . ($frontendPort ? ':' . $frontendPort : '');
                $requestOrigin = $request->getSchemeAndHttpHost();

                if (! $alreadyRedirected && $frontendOrigin !== $requestOrigin) {
                    $frontendCallback = $frontendUrl . '/auth/google/callback?' . http_build_query([
                        'token' => $request->query('token'),
                        'user' => $request->query('user'),
                    ]);

                    return redirect()->away($frontendCallback)->withCookie(cookie(
                        'oauth_google_callback_redirected',
                        '1',
                        5,
                        '/',
                        null,
                        $request->isSecure(),
                        true,
                        false,
                        'lax',
                    ));
                }

                $user = json_decode((string) $request->query('user'), true);

                if (! is_array($user)) {
                    return redirect()->away($frontendUrl . '/auth/login?error=google_callback_user_invalid');
                }

                $bridgeHtml = <<<HTML
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Concluindo login...</title>
</head>
<body>
  <p>Concluindo login com Google...</p>
    <script>
    const token = %s;
    const user = %s;
    if (token) localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    window.location.replace('/filas');
  </script>
</body>
</html>
HTML;

                return response(sprintf($bridgeHtml, Js::from((string) $request->query('token')), Js::from($user)))
                    ->withCookie(Cookie::forget('oauth_google_callback_redirected'));
            }

            if ($request->filled('auth_cookie_set') && $request->filled('user')) {
                $alreadyRedirected = $request->cookie('oauth_google_callback_redirected') === '1';
                $frontendScheme = (string) parse_url($frontendUrl, PHP_URL_SCHEME);
                $frontendHost = (string) parse_url($frontendUrl, PHP_URL_HOST);
                $frontendPort = parse_url($frontendUrl, PHP_URL_PORT);
                $frontendOrigin = $frontendScheme . '://' . $frontendHost . ($frontendPort ? ':' . $frontendPort : '');
                $requestOrigin = $request->getSchemeAndHttpHost();

                if (! $alreadyRedirected && $frontendOrigin !== $requestOrigin) {
                    $frontendCallback = $frontendUrl . '/auth/google/callback?' . http_build_query([
                        'auth_cookie_set' => '1',
                        'user' => $request->query('user'),
                    ]);

                    return redirect()->away($frontendCallback)->withCookie(cookie(
                        'oauth_google_callback_redirected',
                        '1',
                        5,
                        '/',
                        null,
                        $request->isSecure(),
                        true,
                        false,
                        'lax',
                    ));
                }

                $user = json_decode((string) $request->query('user'), true);

                if (! is_array($user)) {
                    return redirect()->away($frontendUrl . '/auth/login?error=google_callback_user_invalid');
                }

                $bridgeHtml = <<<HTML
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Concluindo login...</title>
</head>
<body>
  <p>Concluindo login com Google...</p>
  <script>
    const user = %s;
    localStorage.setItem('auth_user', JSON.stringify(user));
    window.location.replace('/filas');
  </script>
</body>
</html>
HTML;

                return response(sprintf($bridgeHtml, Js::from($user)))
                    ->withCookie(Cookie::forget('oauth_google_callback_redirected'));
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Google callback inválido: parâmetro "code" ausente.',
                ], 422);
            }

            return redirect()->away($frontendUrl . '/auth/login?error=google_callback_code_missing');
        }

        $socialUser = Socialite::driver('google')->stateless()->user();

        $isNew = ! User::where('email', $socialUser->getEmail())->exists();

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            ['name' => $socialUser->getName()],
        );

        if ($isNew) {
            $user->trial_ends_at = Carbon::now()->addDays(30);
            $user->save();
        }

        UserProvider::firstOrCreate([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => $socialUser->getId(),
        ], [
            'created_at' => Carbon::now(),
        ]);

        $plainTextToken = $user->createToken('google')->plainTextToken;

        $userPayload = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'timezone' => $user->timezone,
        ];

        if (request()->expectsJson()) {
            return response()->json([
                'token' => $plainTextToken,
                'user' => $userPayload,
            ])
                ->cookie(
                    'auth_token',
                    $plainTextToken,
                    10080,
                    '/',
                    $this->authCookieDomain($request),
                    $this->authCookieSecure($request),
                    true,
                    false,
                    $this->authCookieSameSite(),
                );
        }

        return redirect()->to($frontendUrl . '/auth/google/callback?' . http_build_query([
            'auth_cookie_set' => '1',
            'user' => json_encode($userPayload),
        ]))->cookie(
            'auth_token',
            $plainTextToken,
            10080,
            '/',
            $this->authCookieDomain($request),
            $this->authCookieSecure($request),
            true,
            false,
            $this->authCookieSameSite(),
        );
    }

}
