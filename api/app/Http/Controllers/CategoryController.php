<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;

class CategoryController extends Controller
{
    public function getAllCategories()
    {
        try {
            $categories = Category::all();

            return response()->json([
                'success' => true,
                'data' => $categories,
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }
}
