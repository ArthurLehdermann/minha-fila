<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DodoWebhookEvent extends Model
{
    protected $table = 'dodo_webhook_events';

    protected $fillable = [
        'webhook_id',
        'event_type',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];
}
