<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Um pagamento no Mercado Pago, de qualquer origem:
 *  - metodo=pix    → avulso, compra um ciclo de acesso quando aprova;
 *  - metodo=cartao → cobrança gerada pela assinatura recorrente.
 */
class Pagamento extends Model
{
    public const METODO_PIX    = 'pix';
    public const METODO_CARTAO = 'cartao';

    public const STATUS_PENDENTE  = 'pending';
    public const STATUS_APROVADO  = 'approved';
    public const STATUS_REJEITADO = 'rejected';
    public const STATUS_CANCELADO = 'cancelled';
    public const STATUS_DEVOLVIDO = 'refunded';

    protected $table = 'pagamentos';

    protected $fillable = [
        'user_id',
        'assinatura_id',
        'metodo',
        'ciclo',
        'mp_payment_id',
        'status',
        'valor',
        'pago_em',
        'acesso_ate',
        'pix_qr_code',
        'pix_qr_code_base64',
        'pix_expira_em',
        'payload',
    ];

    protected $casts = [
        'valor'         => 'decimal:2',
        'pago_em'       => 'datetime',
        'acesso_ate'    => 'datetime',
        'pix_expira_em' => 'datetime',
        'payload'       => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assinatura()
    {
        return $this->belongsTo(Assinatura::class);
    }

    public function aprovado(): bool
    {
        return $this->status === self::STATUS_APROVADO;
    }

    public function pixExpirado(): bool
    {
        return $this->pix_expira_em !== null && $this->pix_expira_em->isPast();
    }
}
