<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where(
            'email',
            'usera@example.com'
        )->firstOrFail();

        $user->pages()->updateOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'About Us',
                'content' => 'NexaTech builds modern digital experiences using Vue, Laravel, and reusable content-management solutions.',
                'status' => 'published',
            ]
        );

        $user->pages()->updateOrCreate(
            ['slug' => 'our-services'],
            [
                'title' => 'Our Services',
                'content' => 'We provide web development, API integration, content management, testing, and responsive user-interface solutions.',
                'status' => 'published',
            ]
        );

        $user->pages()->updateOrCreate(
            ['slug' => 'future-announcement'],
            [
                'title' => 'Future Announcement',
                'content' => 'This draft page demonstrates unpublished content that is visible only through the protected management interface.',
                'status' => 'draft',
            ]
        );
    }
}