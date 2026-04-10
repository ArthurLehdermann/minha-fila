<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('label_ready')->default('PRONTO PARA RETIRADA');
            $table->string('label_preparing')->default('PREPARANDO');
            $table->string('label_waiting')->default('Na Espera');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['label_ready', 'label_preparing', 'label_waiting']);
        });
    }
};
