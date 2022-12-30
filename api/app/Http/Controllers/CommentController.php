<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
    public function index(Request $request, $postId)
    {
        $limit = $request->limit;
        $comments = '';
        if ($limit) {
            $comments = Comment::with('user')->where('post_id', $postId)->offset(0)->limit($limit)->orderBy('created_at', 'desc')->get();
        } else {
            $comments = Comment::with('user')->where('post_id', $postId)->orderBy('created_at', 'desc')->get();
        }

        $data = $comments->map(function ($comment) {
            $images = array_map(function ($image) {
                if ($image !== '') {
                    $img = Image::find($image);
                    if ($img) {
                        return [
                            'imageUrl' => $img->img_link,
                            'size' => \File::size(public_path($img->img_link)),
                        ];
                    }
                }
            }, explode(',', $comment->images));
            $images = array_filter($images, fn ($value) => $value !== null);

            return [
                'id' => $comment->id,
                'postId' => $comment->post_id,
                'userId' => $comment->user_id,
                'content' => $comment->content,
                'images' => $images,
                'createdAt' => $comment->created_at,
                'japaneseFullname' => $comment->user->japanese_fullname,
                'avatar' => $comment->user->avatar,
            ];
        });

        return response()->json(
            [
                'success' => true,
                'data' =>
                    $data,
            ],
            200
        );
    }

    // tao 1 comment
    public function store(Request $request, $postId)
    {
        try {
            $newComment = new Comment();
            $newComment->post_id = $postId;
            $newComment->user_id = $request->input('userId');
            $newComment->content = $request->input('content');

            $images = $request->except('userId', 'content');
            $newComment->images = $this->saveListImage($images);

            $newComment->save();

            return response()->json([
                'success' => true,
                'message' => 'create comment successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function updatePost(Request $request, $commentId)
    {
        try {
            $comment = Comment::where('id', $commentId)->first();
            $images = $request->except(['userId', 'content', 'oldImage']);
            $oldImage = $request->input('oldImage');
            $imageIds = null;
            if ($oldImage) {
                $listOldImage = array_map(function ($image) {
                    $img = Image::where('img_link', $image['imageUrl'])->first();
                    if (!array_key_exists('delete', $image)) {
                        return $img->id;
                    }

                    Storage::disk('public')->delete($img->img_link);
                    $img->delete();
                }, json_decode($oldImage, true));
                $listOldImage = array_filter($listOldImage, fn ($value) => $value !== null);
                $imageIds = implode(',', $listOldImage);
            }

            if ($images) {
                if ($imageIds) {
                    $comment->images = $imageIds.','.$this->saveListImage($images);
                } else {
                    $comment->images = $this->saveListImage($images);
                }
            }

            $comment->content = $request->get('content');
            $comment->save();

            return response()->json([
                'success' => true,
                'message' => 'update comment successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function destroy($commentId)
    {
        try {
            $comment = Comment::find($commentId);
            array_map(function ($image) {
                if ($image !== '') {
                    $img = Image::find($image);
                    if ($img) {
                        Storage::disk('public')->delete($img->img_link);
                        $img->delete();
                    }
                }
            }, explode(',', $comment->images));
            $comment->delete();

            return response()->json([
                'success' => true,
                'message' => 'delete comment successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    /**
     * @param array $images
     * @return string|null
     * @throws Exception
     */
    public function saveListImage(array $images): string|null
    {
        $listImage = array_map(function ($image) {
            $imageName = random_int(100000, 999999).time();
            $storage = Storage::disk('public')->put('images/'.$imageName, file_get_contents($image), 'public');
            if ($storage) {
                $storeImage = new Image();
                $storeImage->img_link = 'images/'.$imageName;
                $storeImage->is_thumbnail = 0;
                $storeImage->type_id = 0;
                $storeImage->save();

                return $storeImage->id;
            }
        }, $images);

        return implode(',', $listImage);
    }
}
