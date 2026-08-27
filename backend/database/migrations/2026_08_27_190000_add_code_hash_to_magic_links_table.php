<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('magic_links', function (Blueprint $table) {
            $table->string('code_hash')->nullable()->after('token_hash');

            $table->index('code_hash');
        });
    }

    public function down(): void
    {
        Schema::table('magic_links', function (Blueprint $table) {
            $table->dropIndex(['code_hash']);
            $table->dropColumn('code_hash');
        });
    }
};
