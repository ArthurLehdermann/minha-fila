<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Vigência do ciclo pago (Pix ou cobrança da assinatura de cartão).
            // O corte de acesso olha isso e trial_ends_at, não o Cashier.
            $table->timestamp('acesso_expira_em')->nullable();
            $table->string('mp_payer_id')->nullable();
        });

        Schema::create('assinaturas', function (Blueprint $table) {
            $table->id();

            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();

            $table->string('ciclo', 10); // mensal | anual

            // Só existe no fluxo de cartão — Pix não gera preapproval, gera
            // pagamento avulso.
            $table->string('mp_preapproval_id')->nullable()->unique();
            $table->string('mp_preapproval_plan_id')->nullable();

            // pending | authorized | paused | cancelled
            $table->string('status', 20)->default('pending')->index();

            $table->timestamp('proxima_cobranca_em')->nullable();
            $table->timestamp('cancelada_em')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();

            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assinatura_id')->nullable()->constrained('assinaturas')->nullOnDelete();

            $table->string('metodo', 10);      // pix | cartao
            $table->string('ciclo', 10);       // mensal | anual

            // Chave de idempotência do webhook: o Mercado Pago reenvia a mesma
            // notificação várias vezes e não podemos creditar acesso duas vezes.
            $table->string('mp_payment_id')->nullable()->unique();

            $table->string('status', 20)->index(); // pending | approved | rejected | cancelled | refunded
            $table->decimal('valor', 10, 2);

            $table->timestamp('pago_em')->nullable();

            // Vigência que este pagamento comprou. Guardado por pagamento para
            // dar auditoria de "por que o usuário tem acesso até tal dia".
            $table->timestamp('acesso_ate')->nullable();

            // Pix: copia-e-cola e QR devolvidos pelo MP, para reexibir a tela
            // enquanto o pagamento não compensa.
            $table->text('pix_qr_code')->nullable();
            $table->text('pix_qr_code_base64')->nullable();
            $table->timestamp('pix_expira_em')->nullable();

            $table->json('payload')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
        Schema::dropIfExists('assinaturas');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['acesso_expira_em', 'mp_payer_id']);
        });
    }
};
