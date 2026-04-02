<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company_id', 8);
            $table->unsignedInteger('number');
            $table->string('label');
            $table->string('status')->default('waiting'); // waiting|preparing|ready|done
            $table->unsignedBigInteger('sequence_id')->default(0);
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->cascadeOnDelete();
            $table->index(['company_id', 'sequence_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
