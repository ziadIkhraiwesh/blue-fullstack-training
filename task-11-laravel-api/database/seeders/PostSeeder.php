<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Getting Started with Laravel',
                'body' => 'This post introduces the basic structure and features of a Laravel application.',
                'status' => 'published',
            ],
            [
                'title' => 'Understanding Laravel Migrations',
                'body' => 'Migrations provide a structured way to create and update database tables.',
                'status' => 'published',
            ],
            [
                'title' => 'Working with Eloquent Models',
                'body' => 'Eloquent provides a simple object-oriented approach for working with database records.',
                'status' => 'published',
            ],
            [
                'title' => 'Building a CRUD REST API',
                'body' => 'This draft explains how controllers, models, routes, and validation work together.',
                'status' => 'draft',
            ],
            [
                'title' => 'Testing Laravel APIs with Postman',
                'body' => 'Postman can be used to test API requests, responses, validation errors, and status codes.',
                'status' => 'draft',
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