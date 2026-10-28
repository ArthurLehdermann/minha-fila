<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;

/**
 * Locales suportados pelo Minha Fila (painel, API e e-mails).
 *
 * Ordem de detecção (middleware SetLocale):
 * usuário autenticado → header/param do frontend → Accept-Language → pt_BR.
 */
class Locale
{
    public const DEFAULT = 'pt_BR';

    /** @var list<string> */
    public const SUPPORTED = ['pt_BR', 'en', 'es'];

    public static function normalize(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $value = str_replace('-', '_', trim($value));

        foreach (self::SUPPORTED as $locale) {
            if (strcasecmp($value, $locale) === 0) {
                return $locale;
            }
        }

        $prefix = strtolower((string) strtok($value, '_'));
        foreach (self::SUPPORTED as $locale) {
            if (strtolower((string) strtok($locale, '_')) === $prefix) {
                return $locale;
            }
        }

        return null;
    }

    /**
     * Resolve locale a partir do request (sem preferência do usuário autenticado).
     * Ordem: body/query `locale`|`lang` → header X-Locale → Accept-Language → default.
     */
    public static function fromRequest(Request $request): string
    {
        $explicit = self::normalize($request->input('locale'))
            ?? self::normalize($request->input('lang'))
            ?? self::normalize($request->query('locale'))
            ?? self::normalize($request->query('lang'))
            ?? self::normalize($request->header('X-Locale'));

        if ($explicit !== null) {
            return $explicit;
        }

        return self::fromAcceptLanguage($request) ?? self::DEFAULT;
    }

    /**
     * Locale para e-mail: preferência salva do usuário (se existir) → request → default.
     */
    public static function forMail(Request $request, ?User $user = null): string
    {
        if ($user !== null) {
            $saved = self::normalize($user->locale);
            if ($saved !== null) {
                return $saved;
            }
        }

        return self::fromRequest($request);
    }

    public static function fromAcceptLanguage(Request $request): ?string
    {
        $header = trim((string) $request->headers->get('Accept-Language', ''));

        // Request::create() do Symfony injeta "en-us,en;q=0.5" quando o
        // cliente não mandou o header (comum em testes HTTP). Ignora isso
        // para não sobrescrever o fallback pt_BR.
        if ($header === '' || strcasecmp($header, 'en-us,en;q=0.5') === 0) {
            return null;
        }

        foreach ($request->getLanguages() as $language) {
            $normalized = self::normalize($language);
            if ($normalized !== null) {
                return $normalized;
            }
        }

        return null;
    }

    /**
     * Código BCP 47 para Intl / HTML lang (pt_BR → pt-BR).
     */
    public static function toBcp47(string $locale): string
    {
        return str_replace('_', '-', $locale);
    }
}
