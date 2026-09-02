<?php

namespace App\Http\Controllers;

use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicPageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $pages = Page::query()
            ->with('user')
            ->where('status', 'published')
            ->latest()
            ->paginate(10);

        return PageResource::collection($pages);
    }

    public function show(string $slug): PageResource|JsonResponse
    {
        $page = Page::query()
            ->with('user')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$page) {
            return response()->json([
                'status' => 'error',
                'message' => 'Page not found.',
            ], 404);
        }

        return new PageResource($page);
    }
}