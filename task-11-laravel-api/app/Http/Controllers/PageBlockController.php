<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContentBlockResource;
use App\Models\ContentBlock;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PageBlockController extends Controller
{
    public function index(
        int $pageId
    ): AnonymousResourceCollection|JsonResponse {
        $page = Page::find($pageId);

        if (!$page) {
            return $this->pageNotFound();
        }

        Gate::authorize('view', $page);

        return ContentBlockResource::collection(
            $page->blocks()->get()
        );
    }

    public function store(
        Request $request,
        int $pageId
    ): ContentBlockResource|JsonResponse {
        $page = Page::find($pageId);

        if (!$page) {
            return $this->pageNotFound();
        }

        Gate::authorize('update', $page);

        $validated = $this->validateBlock(
            $request
        );

        if (!array_key_exists(
            'position',
            $validated
        )) {
            $validated['position'] =
                ((int) $page->blocks()->max(
                    'position'
                )) + 1;
        }

        $block = $page
            ->blocks()
            ->create($validated);

        return new ContentBlockResource(
            $block
        );
    }

    public function update(
        Request $request,
        int $pageId,
        int $blockId
    ): ContentBlockResource|JsonResponse {
        $page = Page::find($pageId);

        if (!$page) {
            return $this->pageNotFound();
        }

        Gate::authorize('update', $page);

        $block = $page->blocks()
            ->find($blockId);

        if (!$block) {
            return $this->blockNotFound();
        }

        $validated = $this->validateBlock(
            $request
        );

        $block->update($validated);

        return new ContentBlockResource(
            $block->fresh()
        );
    }

    public function destroy(
        int $pageId,
        int $blockId
    ): JsonResponse {
        $page = Page::find($pageId);

        if (!$page) {
            return $this->pageNotFound();
        }

        Gate::authorize('update', $page);

        $block = $page->blocks()
            ->find($blockId);

        if (!$block) {
            return $this->blockNotFound();
        }

        $block->delete();

        return response()->json([
            'status' => 'success',
            'message' =>
                'Content block deleted successfully.',
        ]);
    }

    public function reorder(
        Request $request,
        int $pageId
    ): AnonymousResourceCollection|JsonResponse {
        $page = Page::find($pageId);

        if (!$page) {
            return $this->pageNotFound();
        }

        Gate::authorize('update', $page);

        $validated = $request->validate([
            'blocks' => [
                'required',
                'array',
                'min:1',
            ],
            'blocks.*.id' => [
                'required',
                'integer',
                'distinct',
            ],
            'blocks.*.position' => [
                'required',
                'integer',
                'min:0',
                'distinct',
            ],
        ]);

        $pageBlockIds = $page->blocks()
            ->pluck('id');

        $requestedIds = collect(
            $validated['blocks']
        )->pluck('id');

        if (
            $requestedIds->diff(
                $pageBlockIds
            )->isNotEmpty()
        ) {
            return response()->json([
                'status' => 'error',
                'message' =>
                    'One or more blocks do not belong to this page.',
            ], 422);
        }

        DB::transaction(function () use (
            $validated,
            $page
        ): void {
            foreach (
                $validated['blocks'] as $item
            ) {
                $page->blocks()
                    ->whereKey($item['id'])
                    ->update([
                        'position' =>
                            $item['position'],
                    ]);
            }
        });

        return ContentBlockResource::collection(
            $page->blocks()->get()
        );
    }

    private function validateBlock(
        Request $request
    ): array {
        $type = $request->input('type');

        $rules = [
            'type' => [
                'required',
                Rule::in(
                    ContentBlock::SUPPORTED_TYPES
                ),
            ],
            'position' => [
                'sometimes',
                'integer',
                'min:0',
            ],
            'data' => [
                'required',
                'array',
            ],
        ];

        if ($type === ContentBlock::TYPE_HERO) {
            $rules['data.heading'] = [
                'required',
                'string',
                'max:255',
            ];
            $rules['data.subheading'] = [
                'nullable',
                'string',
                'max:500',
            ];
        }

        if ($type === ContentBlock::TYPE_TEXT) {
            $rules['data.heading'] = [
                'nullable',
                'string',
                'max:255',
            ];
            $rules['data.body'] = [
                'required',
                'string',
            ];
        }

        if ($type === ContentBlock::TYPE_CTA) {
            $rules['data.heading'] = [
                'required',
                'string',
                'max:255',
            ];
            $rules['data.text'] = [
                'nullable',
                'string',
                'max:500',
            ];
            $rules['data.button_label'] = [
                'required',
                'string',
                'max:100',
            ];
            $rules['data.button_url'] = [
                'required',
                'string',
                'max:500',
            ];
        }

        if (
            $type ===
            ContentBlock::TYPE_FEATURES
        ) {
            $rules['data.heading'] = [
                'required',
                'string',
                'max:255',
            ];
            $rules['data.items'] = [
                'required',
                'array',
                'min:1',
                'max:10',
            ];
            $rules['data.items.*.title'] = [
                'required',
                'string',
                'max:150',
            ];
            $rules[
                'data.items.*.description'
            ] = [
                'required',
                'string',
                'max:500',
            ];
        }

        return $request->validate($rules);
    }

    private function pageNotFound(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Page not found.',
        ], 404);
    }

    private function blockNotFound(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' =>
                'Content block not found.',
        ], 404);
    }
}