<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (config('database.default') === 'sqlite') {
            Schema::table('companies', function (Blueprint $box) {
                // For SQLite in tests, we use a nullable integer and manage 
                // the increments in the Model since SQLite doesn't help with BIGSERIAL.
                $box->unsignedBigInteger('id_int')->nullable()->unique()->after('owner_id');
            });
        } else {
            // Raw PGSQL for production performance and sequences
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE companies ADD COLUMN id_int BIGSERIAL UNIQUE');
        }
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $box) {
            $box->dropColumn('id_int');
        });
    }
};
