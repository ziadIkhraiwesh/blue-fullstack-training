<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class TrainingController extends Controller
{
    public function profile(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => 1,
                'name' => 'Ziad Ikhraiwesh',
                'training_track' => 'Full-Stack Development',
                'current_task' => 'Task 11 - Laravel Backend Foundations',
            ],
        ], 200);
    }

    public function skills(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'HTML5',
                'CSS3',
                'JavaScript',
                'Vue.js',
                'PHP',
                'Laravel',
                'MySQL',
                'REST APIs',
            ],
        ], 200);
    }

    public function tasks(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->trainingTasks(),
        ], 200);
    }

    public function showTask(int $id): JsonResponse
    {
        $task = collect($this->trainingTasks())->firstWhere('id', $id);

        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Training task not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $task,
        ], 200);
    }

    private function trainingTasks(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Frontend Environment and Semantic HTML',
                'status' => 'completed',
                'estimated_hours' => 8,
            ],
            [
                'id' => 2,
                'title' => 'CSS Architecture and Desktop Styling',
                'status' => 'completed',
                'estimated_hours' => 8,
            ],
            [
                'id' => 3,
                'title' => 'Responsive Design and Mobile Navigation',
                'status' => 'completed',
                'estimated_hours' => 8,
            ],
            [
                'id' => 4,
                'title' => 'JavaScript DOM and Form Validation',
                'status' => 'completed',
                'estimated_hours' => 8,
            ],
            [
                'id' => 5,
                'title' => 'Frontend QA and Deployment',
                'status' => 'completed',
                'estimated_hours' => 8,
            ],
        ];
    }
}