<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->whereNull('trial_ends_at')
            ->update(['trial_ends_at' => now()->addDays(30)]);
    }

    public function down(): void
    {
        // Non-reversible backfill — do not reset
    }
};
