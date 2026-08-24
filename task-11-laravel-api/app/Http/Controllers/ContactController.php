<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
            ],
            'subject' => [
                'nullable',
                'string',
                'max:150',
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:1000',
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contact request received successfully.',
            'data' => $validatedData,
        ], 201);
    }
}