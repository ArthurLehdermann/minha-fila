<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MagicLink extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'email',
        'token_hash',
        'expires_at',
        'used_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public static function hash(string $token): string
    {
        return hash('sha256', $token);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }

    public function markUsed(): void
    {
        $this->update(['used_at' => Carbon::now()]);
    }

    public function consume(): bool
    {
        $affected = DB::table('magic_links')
            ->where('id', $this->id)
            ->whereNull('used_at')
            ->where('expires_at', '>', Carbon::now())
            ->update(['used_at' => Carbon::now()]);

        if ($affected > 0) {
            $this->used_at = Carbon::now();
            return true;
        }

        return false;
    }
}
