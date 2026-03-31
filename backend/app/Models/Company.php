<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'owner_id',
        'name',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Company $company) {
            if (empty($company->id)) {
                $company->id = static::generateShortId();
            }
        });

        static::created(function (Company $company) {
            OrderSequence::create(['company_id' => $company->id]);
        });
    }

    public static function generateShortId(): string
    {
        do {
            $id = Str::lower(Str::random(6));
        } while (static::where('id', $id)->exists());

        return $id;
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function sequence(): HasOne
    {
        return $this->hasOne(OrderSequence::class);
    }
}
