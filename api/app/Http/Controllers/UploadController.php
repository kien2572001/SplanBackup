<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadImage(Request $request)
    {
        $image = $request->file('image');
        $imageName = $request->image_name;
        $storage = Storage::disk('public')->put('images/'.$imageName, file_get_contents($image), 'public');
        if ($storage) {
            return response()->json([
                'status' => 'success',
                'message' => 'Image uploaded successfully',
                'data' => $storage,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Image upload failed',
            'data' => '',
        ]);
    }

    public function getAllImages()
    {
        $files = Storage::disk('public')->files('images');

        return response()->json([
            'status' => 'success',
            'message' => 'Get list file name successfully',
            'data' => $files,
        ]);
    }

    public function deleteByName(Request $request)
    {
        $fileName = $request->file_name;
        $delete = Storage::disk('public')->delete('images/'.$fileName);
        if ($delete) {
            return response()->json([
                'status' => 'success',
                'message' => 'Delete file successfully',
                'data' => '',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Delete file failed',
            'data' => '',
        ]);
    }
}
