<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // We use raw SQL or Schema depending on driver for the change
        // Primary keys and Foreign keys need careful handling
        
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            // Postgres expansion
            DB::statement('ALTER TABLE companies ALTER COLUMN id TYPE VARCHAR(64)');
            DB::statement('ALTER TABLE orders ALTER COLUMN company_id TYPE VARCHAR(64)');
            DB::statement('ALTER TABLE order_sequences ALTER COLUMN company_id TYPE VARCHAR(64)');
        } else {
            // SQLite (CI/Testing) - SQLite doesn't strictly enforce length limits for VARCHAR
            // but we'll try to update the schema for consistency if possible
            // Note: SQLite doesn't support ALTER COLUMN TYPE easily (requires re-creating table)
            // However, SQLite VARCHAR(8) is actually unbounded, the length is just decorative.
            // The error we saw was definitely from Postgres (pgsql driver).
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            // Revert to 8 (CAUTION: this will fail if 30-char IDs exist)
            DB::statement('ALTER TABLE companies ALTER COLUMN id TYPE VARCHAR(8)');
            DB::statement('ALTER TABLE orders ALTER COLUMN company_id TYPE VARCHAR(8)');
            DB::statement('ALTER TABLE order_sequences ALTER COLUMN company_id TYPE VARCHAR(8)');
        }
    }
};
