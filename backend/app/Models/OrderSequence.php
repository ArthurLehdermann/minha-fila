<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class OrderSequence extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'company_id';
    protected $keyType = 'string';

    protected $fillable = [
        'company_id',
        'current_number',
        'current_sequence_id',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public static function nextFor(string $companyId): array
    {
        DB::table('order_sequences')
            ->where('company_id', $companyId)
            ->update([
                'current_number' => DB::raw('current_number + 1'),
                'current_sequence_id' => DB::raw('current_sequence_id + 1'),
            ]);

        $seq = DB::table('order_sequences')
            ->where('company_id', $companyId)
            ->lockForUpdate()
            ->first();

        return [
            'number' => $seq->current_number,
            'sequence_id' => $seq->current_sequence_id,
        ];
    }

    public static function resetFor(string $companyId): void
    {
        DB::table('order_sequences')
            ->where('company_id', $companyId)
            ->update(['current_number' => 0]);
    }
}
