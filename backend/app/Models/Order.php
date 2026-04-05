<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'company_id',
        'number',
        'label',
        'status',
        'sequence_id',
    ];

    public const STATUSES = ['waiting', 'preparing', 'ready', 'done', 'cancelled'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeForCompany($query, string $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeSince($query, int $sequenceId)
    {
        return $query->where('sequence_id', '>', $sequenceId);
    }
}
