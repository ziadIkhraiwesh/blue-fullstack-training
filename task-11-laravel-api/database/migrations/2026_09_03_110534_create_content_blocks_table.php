<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'content_blocks',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('page_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->string('type', 50);
                $table->unsignedInteger('position')
                    ->default(0);

                $table->json('data');

                $table->timestamps();

                $table->index([
                    'page_id',
                    'position',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'content_blocks'
        );
    }
};