<?php

namespace Tests\Unit;

use App\Models\MagicLink;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class MagicLinkTest extends TestCase
{
    public function test_hash_uses_sha256(): void
    {
        $token = 'abc123token';
        $expected = hash('sha256', $token);

        $this->assertSame($expected, MagicLink::hash($token));
    }

    public function test_is_expired_returns_true_when_past(): void
    {
        $link = new MagicLink();
        $link->expires_at = Carbon::now()->subMinutes(5);

        $this->assertTrue($link->isExpired());
    }

    public function test_is_expired_returns_false_when_future(): void
    {
        $link = new MagicLink();
        $link->expires_at = Carbon::now()->addMinutes(10);

        $this->assertFalse($link->isExpired());
    }

    public function test_is_used_returns_false_when_null(): void
    {
        $link = new MagicLink();
        $link->used_at = null;

        $this->assertFalse($link->isUsed());
    }

    public function test_is_used_returns_true_when_set(): void
    {
        $link = new MagicLink();
        $link->used_at = Carbon::now();

        $this->assertTrue($link->isUsed());
    }
}
