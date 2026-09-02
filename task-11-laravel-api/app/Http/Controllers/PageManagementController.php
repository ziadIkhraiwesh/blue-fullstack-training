<?php

namespace App\Http\Controllers;

use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PageManagementController extends Controller
{
    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $pages = $request->user()
            ->pages()
            ->with('user')
            ->latest()
            ->paginate(10);

        return PageResource::collection($pages);
    }

    public function show(
        Request $request,
        int $id
    ): PageResource|JsonResponse {
        $page = Page::with('user')->find($id);

        if (!$page) {
            return response()->json([
                'status' => 'error',
                'message' => 'Page not found.',
            ], 404);
        }

        Gate::authorize('view', $page);

        return new PageResource($page);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'unique:pages,slug',
            ],
            'content' => [
                'required',
                'string',
            ],
            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                ]),
            ],
        ]);

        $page = $request->user()
            ->pages()
            ->create($validatedData);

        $page->load('user');

        return (new PageResource($page))
            ->response()
            ->setStatusCode(201);
    }

    public function update(
        Request $request,
        int $id
    ): PageResource|JsonResponse {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'status' => 'error',
                'message' => 'Page not found.',
            ], 404);
        }

        Gate::authorize('update', $page);

        $validatedData = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('pages', 'slug')
                    ->ignore($page->id),
            ],
            'content' => [
                'required',
                'string',
            ],
            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                ]),
            ],
        ]);

        $page->update($validatedData);
        $page->load('user');

        return new PageResource($page);
    }

    public function destroy(int $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'status' => 'error',
                'message' => 'Page not found.',
            ], 404);
        }

        Gate::authorize('delete', $page);

        $page->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Page deleted successfully.',
        ]);
    }
}