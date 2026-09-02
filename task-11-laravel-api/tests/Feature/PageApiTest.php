<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageApiTest extends TestCase
{
    use RefreshDatabase;

    private function createPage(
        User $user,
        array $attributes = []
    ): Page {
        return $user->pages()->create(array_merge([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'Public page content.',
            'status' => 'published',
        ], $attributes));
    }

    public function test_public_user_can_view_published_page_by_slug(): void
    {
        $user = User::factory()->create();

        $this->createPage($user);

        $this->getJson('/api/pages/about-us')
            ->assertOk()
            ->assertJsonPath('data.title', 'About Us')
            ->assertJsonPath('data.slug', 'about-us')
            ->assertJsonPath(
                'data.status',
                'published'
            );
    }

    public function test_public_user_cannot_view_draft_page(): void
    {
        $user = User::factory()->create();

        $this->createPage($user, [
            'title' => 'Draft Page',
            'slug' => 'draft-page',
            'status' => 'draft',
        ]);

        $this->getJson('/api/pages/draft-page')
            ->assertNotFound()
            ->assertJsonPath(
                'message',
                'Page not found.'
            );
    }

    public function test_public_pages_list_contains_only_published_pages(): void
    {
        $user = User::factory()->create();

        $this->createPage($user);

        $this->createPage($user, [
            'title' => 'Hidden Draft',
            'slug' => 'hidden-draft',
            'status' => 'draft',
        ]);

        $this->getJson('/api/pages')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.slug',
                'about-us'
            );
    }

    public function test_management_routes_require_authentication(): void
    {
        $this->getJson('/api/manage/pages')
            ->assertUnauthorized();

        $this->postJson('/api/manage/pages', [
            'title' => 'Protected Page',
            'slug' => 'protected-page',
            'content' => 'Protected content.',
            'status' => 'published',
        ])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_page(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/manage/pages', [
            'title' => 'Contact Information',
            'slug' => 'contact-information',
            'content' => 'Contact page content.',
            'status' => 'draft',
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.slug',
                'contact-information'
            )
            ->assertJsonPath(
                'data.author.id',
                $user->id
            );

        $this->assertDatabaseHas('pages', [
            'slug' => 'contact-information',
            'status' => 'draft',
            'user_id' => $user->id,
        ]);
    }

    public function test_duplicate_slug_returns_validation_error(): void
    {
        $user = User::factory()->create();

        $this->createPage($user);

        Sanctum::actingAs($user);

        $this->postJson('/api/manage/pages', [
            'title' => 'Duplicate About Page',
            'slug' => 'about-us',
            'content' => 'Duplicate content.',
            'status' => 'published',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');
    }

    public function test_user_cannot_update_another_users_page(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $page = $this->createPage($owner);

        Sanctum::actingAs($otherUser);

        $this->putJson(
            "/api/manage/pages/{$page->id}",
            [
                'title' => 'Forbidden Update',
                'slug' => 'forbidden-update',
                'content' => 'This must not be saved.',
                'status' => 'draft',
            ]
        )
            ->assertForbidden();

        $this->assertDatabaseMissing('pages', [
            'id' => $page->id,
            'title' => 'Forbidden Update',
        ]);
    }

    public function test_missing_public_page_returns_404(): void
    {
        $this->getJson('/api/pages/missing-page')
            ->assertNotFound()
            ->assertJsonPath(
                'message',
                'Page not found.'
            );
    }
}