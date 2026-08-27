<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'trial_ends_at',
        'timezone',
        'acesso_expira_em',
        'mp_payer_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'acesso_expira_em' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function providers(): HasMany
    {
        return $this->hasMany(UserProvider::class);
    }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class, 'owner_id');
    }

    public function assinaturas(): HasMany
    {
        return $this->hasMany(Assinatura::class);
    }

    public function pagamentos(): HasMany
    {
        return $this->hasMany(Pagamento::class);
    }

    /**
     * Assinatura recorrente de cartão em vigor no Mercado Pago, se houver.
     * Pix não cria assinatura — cada pagamento compra um ciclo isolado.
     */
    public function assinaturaCartao(): ?Assinatura
    {
        return $this->assinaturas()
            ->where('status', Assinatura::STATUS_AUTORIZADA)
            ->latest('id')
            ->first();
    }

    public function emTrial(): bool
    {
        return $this->trial_ends_at !== null && $this->trial_ends_at->isFuture();
    }

    /**
     * Existe ciclo pago vigente? Vale tanto para Pix (pagamento avulso) quanto
     * para cartão (cada cobrança aprovada empurra a data).
     */
    public function acessoPago(): bool
    {
        if ($this->acesso_expira_em === null) {
            return false;
        }

        $carencia = (int) config('mercadopago.carencia_dias');

        return $this->acesso_expira_em->copy()->addDays($carencia)->isFuture();
    }

    public function acessoBloqueado(): bool
    {
        return ! $this->emTrial() && ! $this->acessoPago();
    }

    /**
     * Data em que o acesso acaba, considerando trial e ciclo pago.
     */
    public function acessoAte(): ?Carbon
    {
        $datas = array_filter([$this->trial_ends_at, $this->acesso_expira_em]);

        if (! $datas) {
            return null;
        }

        return collect($datas)->max();
    }
}
