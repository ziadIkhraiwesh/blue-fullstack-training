<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $userA = User::updateOrCreate(
            ['email' => 'usera@example.com'],
            [
                'name' => 'Test User A',
                'password' => Hash::make('Password123!'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'userb@example.com'],
            [
                'name' => 'Test User B',
                'password' => Hash::make('Password123!'),
            ]
        );

        Post::whereNull('user_id')->update([
            'user_id' => $userA->id,
        ]);
    }
}