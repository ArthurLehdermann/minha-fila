<?php

namespace App\Models;

use App\Services\QrCodeService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_int',
        'owner_id',
        'name',
        'status',
        'qr_code_url',
        'label_ready',
        'label_preparing',
        'label_waiting',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Company $company) {
            if (empty($company->id)) {
                try {
                    // We use DB to get the next ID from the sequence in Postgres
                    // or a fallback for SQLite/Testing environments.
                    if (config('database.default') === 'pgsql') {
                        $result = DB::select("SELECT nextval('companies_id_int_seq') as next");
                        $nextId = (int) ($result[0]->next ?? 1);
                    } else {
                        // Fallback for CI/SQLite tests
                        $nextId = (static::max('id_int') ?? 0) + 1;
                    }

                    $company->id_int = $nextId;
                    $company->id = static::generateShortId($nextId);
                    
                    Log::info("Nova fila sendo criada", ['id' => $company->id, 'id_int' => $nextId]);
                } catch (\Exception $e) {
                    Log::error("Erro fatal ao gerar ID para Fila", ['msg' => $e->getMessage()]);
                    // Final fallback just to not break things in worst case scenario
                    $company->id = 'err_' . Str::random(24);
                }
            }
        });

        static::created(function (Company $company) {
            OrderSequence::create(['company_id' => $company->id]);

            try {
                $publicUrl = config('app.frontend_url', 'https://minha-fila.meugarcom.app') . '/filas/' . $company->id;
                $qrUrl = app(QrCodeService::class)->generateForQueue($company->id, $publicUrl);
                $company->updateQuietly(['qr_code_url' => $qrUrl]);
                Log::info('QR Code gerado para fila', ['company_id' => $company->id, 'qr_url' => $qrUrl]);
            } catch (\Throwable $e) {
                Log::error('Falha ao gerar QR Code para fila', ['company_id' => $company->id, 'error' => $e->getMessage()]);
            }
        });
    }

    public static function generateShortId(int $idInt): string
    {
        if (!class_exists('\Sqids\Sqids')) {
            Log::warning("Classe Sqids não encontrada, usando fallback de ID aleatório.");
            return Str::random(30);
        }

        // Alphabet without ambiguous characters (no 0, 1, I, O, L)
        $sqids = new \Sqids\Sqids(
            alphabet: 'abcdefghjkmnpqrstuvwxyz23456789',
            minLength: 30
        );
        return $sqids->encode([$idInt]);
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
