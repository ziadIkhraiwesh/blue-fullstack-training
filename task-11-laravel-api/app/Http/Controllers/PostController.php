<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:draft,published'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'sort_by' => ['nullable', 'in:created_at,title'],
            'sort_direction' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 5;

        $posts = Post::query()
            ->with('category', 'user')
            ->when(
                $validated['search'] ?? null,
                fn($query, $search) =>
                $query->where('title', 'like', "%{$search}%")
            )
            ->when(
                $validated['status'] ?? null,
                fn($query, $status) =>
                $query->where('status', $status)
            )
            ->when(
                $validated['category_id'] ?? null,
                fn($query, $categoryId) =>
                $query->where('category_id', $categoryId)
            )
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return PostResource::collection($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
        ]);

        $post = $request->user()->posts()->create($validatedData);
        $post->load(['category', 'user']);

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): PostResource|JsonResponse
    {
        $post = Post::with(['category', 'user'])->find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        return new PostResource($post);
    }

    public function update(Request $request, int $id): PostResource|JsonResponse
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        Gate::authorize('update', $post);

        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
        ]);

        $post->update($validatedData);
        $post->load(['category', 'user']);

        return new PostResource($post);
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

        Gate::authorize('delete', $post);

        $post->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully.',
        ], 200);
    }
}