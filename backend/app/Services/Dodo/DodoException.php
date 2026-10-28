<?php

namespace App\Services\Dodo;

use RuntimeException;

class DodoException extends RuntimeException
{
    public static function fromResponse(string $action, int $status, string $body): self
    {
        return new self("Dodo Payments [{$status}] {$action}: ".mb_substr($body, 0, 500), $status);
    }
}
