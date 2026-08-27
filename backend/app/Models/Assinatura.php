<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Assinatura recorrente de cartão no Mercado Pago (preapproval).
 *
 * Pix não passa por aqui: não existe débito recorrente em Pix, então cada
 * pagamento Pix é um Pagamento avulso que compra um ciclo de acesso.
 */
class Assinatura extends Model
{
    public const STATUS_PENDENTE   = 'pending';
    public const STATUS_AUTORIZADA = 'authorized';
    public const STATUS_PAUSADA    = 'paused';
    public const STATUS_CANCELADA  = 'cancelled';

    protected $table = 'assinaturas';

    protected $fillable = [
        'user_id',
        'ciclo',
        'mp_preapproval_id',
        'mp_preapproval_plan_id',
        'status',
        'proxima_cobranca_em',
        'cancelada_em',
    ];

    protected $casts = [
        'proxima_cobranca_em' => 'datetime',
        'cancelada_em'        => 'datetime',
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

    public function scopeAtiva($query)
    {
        return $query->where('status', self::STATUS_AUTORIZADA);
    }
}
