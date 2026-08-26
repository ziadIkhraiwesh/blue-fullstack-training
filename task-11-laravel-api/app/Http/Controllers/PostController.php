<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Posts retrieved successfully.',
            'data' => $posts,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
        ]);

        $post = Post::create($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Post created successfully.',
            'data' => $post,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Post retrieved successfully.',
            'data' => $post,
        ], 200);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
        ]);

        $post->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Post updated successfully.',
            'data' => $post->fresh(),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        $post->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully.',
        ], 200);
    }
}