<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class ContentBlockSeeder extends Seeder
{
    public function run(): void
    {
        $page = Page::where(
            'slug',
            'about-us'
        )->firstOrFail();

        $page->blocks()->updateOrCreate(
            ['position' => 1],
            [
                'type' => 'hero',
                'data' => [
                    'heading' =>
                        'Building Better Digital Experiences',
                    'subheading' =>
                        'NexaTech combines Vue, Laravel, and reusable CMS-style content blocks.',
                ],
            ]
        );

        $page->blocks()->updateOrCreate(
            ['position' => 2],
            [
                'type' => 'text',
                'data' => [
                    'heading' =>
                        'About Our Approach',
                    'body' =>
                        'We build maintainable applications by separating public presentation, content management, API logic, and database storage.',
                ],
            ]
        );

        $page->blocks()->updateOrCreate(
            ['position' => 3],
            [
                'type' => 'features',
                'data' => [
                    'heading' =>
                        'What We Deliver',
                    'items' => [
                        [
                            'title' =>
                                'Reusable Content',
                            'description' =>
                                'Manage page sections without duplicating fixed layouts.',
                        ],
                        [
                            'title' =>
                                'Secure APIs',
                            'description' =>
                                'Protect management operations using authentication and authorization.',
                        ],
                        [
                            'title' =>
                                'Dynamic Rendering',
                            'description' =>
                                'Render each block using a reusable Vue component.',
                        ],
                    ],
                ],
            ]
        );

        $page->blocks()->updateOrCreate(
            ['position' => 4],
            [
                'type' => 'cta',
                'data' => [
                    'heading' =>
                        'Start Your Next Project',
                    'text' =>
                        'Contact NexaTech to discuss your next digital experience.',
                    'button_label' =>
                        'Contact Us',
                    'button_url' =>
                        '/contact',
                ],
            ]
        );
    }
}