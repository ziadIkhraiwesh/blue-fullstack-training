<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Task 17 User',
            'email' => 'task17@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.user.email', 'task17@example.com')
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'user',
                    'token',
                ],
            ])
            ->assertJsonMissingPath('data.user.password');

        $this->assertDatabaseHas('users', [
            'email' => 'task17@example.com',
        ]);
    }

    public function test_user_can_login_access_me_and_logout(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('Password123!'),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'Password123!',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonMissingPath('data.user.password');

        $token = $loginResponse->json('data.token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath(
                'data.user.email',
                'login@example.com'
            )
            ->assertJsonMissingPath('data.user.password');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Logged out successfully.'
            );

        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }

    public function test_invalid_login_credentials_are_rejected(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('Password123!'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }
}