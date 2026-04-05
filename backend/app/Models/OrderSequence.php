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
        return DB::transaction(function () use ($companyId) {
            $seq = DB::table('order_sequences')
                ->where('company_id', $companyId)
                ->lockForUpdate()
                ->first();

            if (! $seq) {
                DB::table('order_sequences')->insert([
                    'company_id' => $companyId,
                    'current_number' => 0,
                    'current_sequence_id' => 0,
                ]);

                $seq = DB::table('order_sequences')
                    ->where('company_id', $companyId)
                    ->lockForUpdate()
                    ->first();
            }

            $nextNumber = $seq->current_number + 1;
            $nextSequenceId = $seq->current_sequence_id + 1;

            DB::table('order_sequences')
                ->where('company_id', $companyId)
                ->update([
                    'current_number' => $nextNumber,
                    'current_sequence_id' => $nextSequenceId,
                ]);

            return [
                'number' => $nextNumber,
                'sequence_id' => $nextSequenceId,
            ];
        });
    }

    public static function resetFor(string $companyId): void
    {
        DB::table('order_sequences')
            ->where('company_id', $companyId)
            ->update(['current_number' => 0]);
    }

    public static function nextSequenceIdFor(string $companyId): int
    {
        return DB::transaction(function () use ($companyId) {
            $seq = DB::table('order_sequences')
                ->where('company_id', $companyId)
                ->lockForUpdate()
                ->first();

            $nextSequenceId = $seq->current_sequence_id + 1;

            DB::table('order_sequences')
                ->where('company_id', $companyId)
                ->update([
                    'current_sequence_id' => $nextSequenceId,
                ]);

            return $nextSequenceId;
        });
    }
}
