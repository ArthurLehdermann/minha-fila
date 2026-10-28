<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Assinatura recorrente: cartão Mercado Pago (preapproval) ou Dodo Payments.
 *
 * Pix não passa por aqui: não existe débito recorrente em Pix, então cada
 * pagamento Pix é um Pagamento avulso que compra um ciclo de acesso.
 */
class Assinatura extends Model
{
    public const STATUS_PENDENTE = 'pending';

    public const STATUS_AUTORIZADA = 'authorized';

    public const STATUS_PAUSADA = 'paused';

    public const STATUS_CANCELADA = 'cancelled';

    public const GATEWAY_MERCADO_PAGO = 'mercadopago';

    public const GATEWAY_DODO = 'dodo';

    protected $table = 'assinaturas';

    protected $fillable = [
        'user_id',
        'ciclo',
        'gateway',
        'mp_preapproval_id',
        'mp_preapproval_plan_id',
        'dodo_subscription_id',
        'dodo_customer_id',
        'status',
        'proxima_cobranca_em',
        'cancelada_em',
    ];

    protected $casts = [
        'proxima_cobranca_em' => 'datetime',
        'cancelada_em' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class);
    }

    public function estaAtiva(): bool
    {
        return $this->status === self::STATUS_AUTORIZADA;
    }

    public function isDodo(): bool
    {
        return $this->gateway === self::GATEWAY_DODO
            || filled($this->dodo_subscription_id);
    }

    public function isMercadoPago(): bool
    {
        return ! $this->isDodo();
    }

    public function scopeAtiva($query)
    {
        return $query->where('status', self::STATUS_AUTORIZADA);
    }
}
