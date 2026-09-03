<?php

namespace Tests\Feature;

use App\Models\ContentBlock;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentBlockApiTest extends TestCase
{
    use RefreshDatabase;

    private function createPage(
        User $user
    ): Page {
        return $user->pages()->create([
            'title' => 'Dynamic Page',
            'slug' => 'dynamic-page',
            'content' => 'Fallback page content.',
            'status' => 'published',
        ]);
    }

    private function createBlock(
        Page $page,
        string $type,
        int $position,
        array $data
    ): ContentBlock {
        return $page->blocks()->create([
            'type' => $type,
            'position' => $position,
            'data' => $data,
        ]);
    }

    public function test_page_returns_blocks_in_display_order(): void
    {
        $user = User::factory()->create();
        $page = $this->createPage($user);

        $this->createBlock(
            $page,
            'text',
            2,
            [
                'heading' => 'Second',
                'body' => 'Second block.',
            ]
        );

        $this->createBlock(
            $page,
            'hero',
            1,
            [
                'heading' => 'First',
                'subheading' => 'First block.',
            ]
        );

        $this->getJson(
            '/api/pages/dynamic-page'
        )
            ->assertOk()
            ->assertJsonPath(
                'data.blocks.0.type',
                'hero'
            )
            ->assertJsonPath(
                'data.blocks.0.position',
                1
            )
            ->assertJsonPath(
                'data.blocks.1.type',
                'text'
            )
            ->assertJsonPath(
                'data.blocks.1.position',
                2
            );
    }

    public function test_block_management_requires_authentication(): void
    {
        $user = User::factory()->create();
        $page = $this->createPage($user);

        $this->getJson(
            "/api/manage/pages/{$page->id}/blocks"
        )
            ->assertUnauthorized();

        $this->postJson(
            "/api/manage/pages/{$page->id}/blocks",
            [
                'type' => 'text',
                'data' => [
                    'body' =>
                        'Protected block.',
                ],
            ]
        )
            ->assertUnauthorized();
    }

    public function test_owner_can_create_content_block(): void
    {
        $user = User::factory()->create();
        $page = $this->createPage($user);

        Sanctum::actingAs($user);

        $this->postJson(
            "/api/manage/pages/{$page->id}/blocks",
            [
                'type' => 'hero',
                'position' => 1,
                'data' => [
                    'heading' =>
                        'Managed Hero',
                    'subheading' =>
                        'Created through the API.',
                ],
            ]
        )
            ->assertCreated()
            ->assertJsonPath(
                'type',
                'hero'
            )
            ->assertJsonPath(
                'position',
                1
            );

        $this->assertDatabaseHas(
            'content_blocks',
            [
                'page_id' => $page->id,
                'type' => 'hero',
                'position' => 1,
            ]
        );
    }

    public function test_unsupported_block_type_is_rejected(): void
    {
        $user = User::factory()->create();
        $page = $this->createPage($user);

        Sanctum::actingAs($user);

        $this->postJson(
            "/api/manage/pages/{$page->id}/blocks",
            [
                'type' => 'unsupported',
                'data' => [
                    'body' => 'Invalid block.',
                ],
            ]
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors(
                'type'
            );
    }

    public function test_non_owner_cannot_manage_page_blocks(): void
    {
        $owner = User::factory()->create();
        $otherUser =
            User::factory()->create();
        $page = $this->createPage($owner);

        Sanctum::actingAs($otherUser);

        $this->postJson(
            "/api/manage/pages/{$page->id}/blocks",
            [
                'type' => 'text',
                'data' => [
                    'body' =>
                        'Forbidden content.',
                ],
            ]
        )
            ->assertForbidden();

        $this->assertDatabaseCount(
            'content_blocks',
            0
        );
    }

    public function test_owner_can_reorder_blocks(): void
    {
        $user = User::factory()->create();
        $page = $this->createPage($user);

        $hero = $this->createBlock(
            $page,
            'hero',
            1,
            [
                'heading' => 'Hero',
            ]
        );

        $text = $this->createBlock(
            $page,
            'text',
            2,
            [
                'body' => 'Text content.',
            ]
        );

        Sanctum::actingAs($user);

        $this->putJson(
            "/api/manage/pages/{$page->id}/blocks/reorder",
            [
                'blocks' => [
                    [
                        'id' => $text->id,
                        'position' => 1,
                    ],
                    [
                        'id' => $hero->id,
                        'position' => 2,
                    ],
                ],
            ]
        )
            ->assertOk()
            ->assertJsonPath(
                'data.0.id',
                $text->id
            )
            ->assertJsonPath(
                'data.0.position',
                1
            )
            ->assertJsonPath(
                'data.1.id',
                $hero->id
            )
            ->assertJsonPath(
                'data.1.position',
                2
            );
    }
}