<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentBlock extends Model
{
    use HasFactory;

    public const TYPE_HERO = 'hero';
    public const TYPE_TEXT = 'text';
    public const TYPE_CTA = 'cta';
    public const TYPE_FEATURES = 'features';

    public const SUPPORTED_TYPES = [
        self::TYPE_HERO,
        self::TYPE_TEXT,
        self::TYPE_CTA,
        self::TYPE_FEATURES,
    ];

    protected $fillable = [
        'type',
        'position',
        'data',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'data' => 'array',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}