<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'application_name' => config('app.name'),
            'message' => 'Laravel API is running successfully.',
        ], 200);
    }
}