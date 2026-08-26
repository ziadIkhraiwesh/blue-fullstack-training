<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $technology = Category::where('slug', 'technology')->firstOrFail();
        $business = Category::where('slug', 'business')->firstOrFail();
        $education = Category::where('slug', 'education')->firstOrFail();

        Post::whereNull('category_id')->update([
            'category_id' => $technology->id,
        ]);

        $posts = [
            [
                'title' => 'Getting Started with Laravel',
                'body' => 'This post introduces the basic structure and features of a Laravel application.',
                'status' => 'published',
                'category_id' => $technology->id,
            ],
            [
                'title' => 'Understanding Laravel Migrations',
                'body' => 'Migrations provide a structured way to create and update database tables.',
                'status' => 'published',
                'category_id' => $education->id,
            ],
            [
                'title' => 'Working with Eloquent Models',
                'body' => 'Eloquent provides a simple object-oriented approach for working with database records.',
                'status' => 'published',
                'category_id' => $technology->id,
            ],
            [
                'title' => 'Building a CRUD REST API',
                'body' => 'This draft explains how controllers, models, routes, and validation work together.',
                'status' => 'draft',
                'category_id' => $technology->id,
            ],
            [
                'title' => 'Testing Laravel APIs with Postman',
                'body' => 'Postman can be used to test API requests, responses, validation errors, and status codes.',
                'status' => 'draft',
                'category_id' => $education->id,
            ],
            [
                'title' => 'Technology Solutions for Business',
                'body' => 'Modern API solutions can improve business processes and support frontend applications.',
                'status' => 'published',
                'category_id' => $business->id,
            ],
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(
                ['title' => $post['title']],
                $post
            );
        }
    }
}