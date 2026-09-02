<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageManagementController;
use App\Http\Controllers\PublicPageController;

Route::get('/health', [
    HealthController::class,
    'index',
]);

Route::get('/profile', [
    TrainingController::class,
    'profile',
]);

Route::get('/skills', [
    TrainingController::class,
    'skills',
]);

Route::get('/training/tasks', [
    TrainingController::class,
    'tasks',
]);

Route::get('/training/tasks/{id}', [
    TrainingController::class,
    'showTask',
])->whereNumber('id');

Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/contact', [
    ContactController::class,
    'store',
]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::patch('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::get('/manage/pages', [
        PageManagementController::class,
        'index',
    ]);

    Route::get('/manage/pages/{id}', [
        PageManagementController::class,
        'show',
    ])->whereNumber('id');

    Route::post('/manage/pages', [
        PageManagementController::class,
        'store',
    ]);

    Route::put('/manage/pages/{id}', [
        PageManagementController::class,
        'update',
    ])->whereNumber('id');

    Route::patch('/manage/pages/{id}', [
        PageManagementController::class,
        'update',
    ])->whereNumber('id');

    Route::delete('/manage/pages/{id}', [
        PageManagementController::class,
        'destroy',
    ])->whereNumber('id');
});
Route::get('/pages', [
    PublicPageController::class,
    'index',
]);

Route::get('/pages/{slug}', [
    PublicPageController::class,
    'show',
]);