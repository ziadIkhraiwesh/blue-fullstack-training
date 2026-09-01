<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    private function createCategory(): Category
    {
        return Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
        ]);
    }

    private function createPost(
        User $user,
        Category $category,
        array $attributes = []
    ): Post {
        return $user->posts()->create(array_merge([
            'title' => 'Task 17 Test Post',
            'body' => 'This post is used for automated API testing.',
            'status' => 'published',
            'category_id' => $category->id,
        ], $attributes));
    }

    public function test_unauthenticated_user_cannot_create_post(): void
    {
        $category = $this->createCategory();

        $this->postJson('/api/posts', [
            'title' => 'Unauthorized Post',
            'body' => 'This request must be rejected.',
            'status' => 'published',
            'category_id' => $category->id,
        ])
            ->assertUnauthorized();

        $this->assertDatabaseMissing('posts', [
            'title' => 'Unauthorized Post',
        ]);
    }

    public function test_authenticated_user_can_create_owned_post(): void
    {
        $user = User::factory()->create();
        $category = $this->createCategory();

        Sanctum::actingAs($user);

        $this->postJson('/api/posts', [
            'title' => 'Authenticated Post',
            'body' => 'This post belongs to the authenticated user.',
            'status' => 'published',
            'category_id' => $category->id,
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.title',
                'Authenticated Post'
            )
            ->assertJsonPath(
                'data.author.id',
                $user->id
            );

        $this->assertDatabaseHas('posts', [
            'title' => 'Authenticated Post',
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);
    }

    public function test_post_creation_validation_failure_returns_422(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/posts', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'body',
                'status',
                'category_id',
            ]);
    }

    public function test_user_cannot_update_another_users_post(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $category = $this->createCategory();
        $post = $this->createPost($owner, $category);

        Sanctum::actingAs($otherUser);

        $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Forbidden Update',
            'body' => 'This update must not be saved.',
            'status' => 'draft',
            'category_id' => $category->id,
        ])
            ->assertForbidden();

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
            'title' => 'Forbidden Update',
        ]);
    }

    public function test_user_cannot_delete_another_users_post(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $category = $this->createCategory();
        $post = $this->createPost($owner, $category);

        Sanctum::actingAs($otherUser);

        $this->deleteJson("/api/posts/{$post->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
        ]);
    }

    public function test_posts_listing_returns_paginated_posts(): void
    {
        $user = User::factory()->create();
        $category = $this->createCategory();

        $this->createPost($user, $category, [
            'title' => 'Laravel Testing',
        ]);

        $this->getJson('/api/posts')
            ->assertOk()
            ->assertJsonPath(
                'data.0.title',
                'Laravel Testing'
            )
            ->assertJsonStructure([
                'data',
                'links',
                'meta',
            ]);
    }

    public function test_missing_post_returns_404(): void
    {
        $this->getJson('/api/posts/99999')
            ->assertNotFound()
            ->assertJsonPath(
                'message',
                'Post not found.'
            );
    }
}