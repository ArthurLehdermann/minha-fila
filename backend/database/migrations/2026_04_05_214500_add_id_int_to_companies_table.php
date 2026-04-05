<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // We use raw SQL to ensure Postgres creates a SERIAL column 
        // without attempting to make it a Primary Key.
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE companies ADD COLUMN id_int BIGSERIAL UNIQUE');
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $box) {
            $box->dropColumn('id_int');
        });
    }
};
