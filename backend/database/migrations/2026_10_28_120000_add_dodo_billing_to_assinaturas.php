<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assinaturas', function (Blueprint $table) {
            // mercadopago | dodo — null = legado Mercado Pago (pré-Dodo)
            $table->string('gateway', 20)->nullable()->after('ciclo');
            $table->string('dodo_subscription_id')->nullable()->unique()->after('mp_preapproval_plan_id');
            $table->string('dodo_customer_id')->nullable()->after('dodo_subscription_id');
        });

        Schema::create('dodo_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('webhook_id')->unique();
            $table->string('event_type', 80)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dodo_webhook_events');

        Schema::table('assinaturas', function (Blueprint $table) {
            $table->dropColumn(['gateway', 'dodo_subscription_id', 'dodo_customer_id']);
        });
    }
};
