<?php

namespace App\Http\Controllers;

use App\Enums\PostType;
use App\Enums\UserRole;
use App\Models\PlanDetail;
use App\Models\Post;
use App\Models\SubPost;
use App\Models\Target;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function getAllPosts(Request $request)
    {
        $user = Auth::user();
        //0:progress 1:plan_edit 2:target_result
        //Chia lai cac loai Post
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        $users = User::where('role', 1)->get();

        if ($user->role === UserRole::CLIENT || $user->role === UserRole::NAITEISHA) {
            $manager = User::with('companies')->where('id', '=', $user->id)->first();
            $companyName = $manager->companies->first()->company_name;
            $users = User::with('companies')->get();
            $users = $users->filter(function ($user) use ($companyName) {
                return $user->companies->count() > 0 && $user->role === 1 && $user->companies->first()->company_name === $companyName;
            });
        }

        $allPost = collect([]);

        foreach ($users as $user) {
            $posts = Post::with('planDetails.document.unit', 'likes', 'comments')
                ->withCount('likes', 'comments')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')->paginate(5);
            foreach ($posts as $post) {
                $allPost->push($post);
            }
        }

        $responsePosts = $allPost->map(function ($post) {
            $user = User::where('id', $post->user_id)->first();
            $userName = $user->japanese_fullname;
            $avatar = $user->avatar;
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            switch ($post->type) {
                case PostType::NEW_TARGET:
                    $subPosts = $post->subPosts->map((function ($subPost) {
                        return [
                            'id' => $subPost->id,
                            'postId' => $subPost->post_id,
                            'content' => $subPost->content,
                            'subContent' => $subPost->sub_content,
                            'documentName' => $subPost->document_name,
                            'type' => $subPost->type,
                        ];
                    }));

                    return [
                        'japanese_fullname' => $userName,
                        'id' => $post->id,
                        'content' => $post->content,
                        'subContent' => $post->sub_content,
                        'type' => $post->type,
                        'userId' => $post->user_id,
                        'likesCount' => $post->likes_count,
                        'commentsCount' => $post->comments_count,
                        'createdAt' => $post->created_at,
                        'likes' => $likes,
                        'comments' => $comments,
                        'avatar' => $avatar,
                        'subPosts' => $subPosts,
                    ];
                case PostType::TARGET_RESULT:
                    $subPosts = $post->subPosts->map((function ($subPost) {
                        return [
                            'id' => $subPost->id,
                            'postId' => $subPost->post_id,
                            'content' => $subPost->content,
                            'contestName' => $subPost->contest_name,
                            'contestDate' => $subPost->contest_date,
                            'maxScore' => $subPost->max_score,
                            'expectedScore' => $subPost->expected_score,
                            'achievedScore' => $subPost->achieved_score,
                            'type' => $subPost->type,
                        ];
                    }));

                    return [
                        'japanese_fullname' => $userName,
                        'id' => $post->id,
                        'content' => $post->content,
                        'subContent' => $post->sub_content,
                        'type' => $post->type,
                        'userId' => $post->user_id,
                        'likesCount' => $post->likes_count,
                        'commentsCount' => $post->comments_count,
                        'likes' => $likes,
                        'comments' => $comments,
                        'avatar' => $avatar,
                        'subPosts' => $subPosts,
                        'createdAt' => $post->created_at,
                        'success' => $post->success,
                    ];
                case PostType::USERPOST:
                    $temp = strval($post->real_amount);
                    $unit = $post->planDetails->document->unit->name;
                    $timeOnly = false;
                    if ($unit === '時間') {
                        $content = "$temp 時間";
                        $timeOnly = true;
                    } else {
                        $content  = "$temp $unit";
                        if ($post->real_time !== null) {
                            $tmp = strval($post->real_time);
                            $content = "$content / $tmp 時間";
                        }
                    }

                    return [
                        'japanese_fullname' => $userName,
                        'id' => $post->id,
                        'memo' => $post->content,
                        'realAmount' => $post->real_amount,
                        'realTime' => $post->real_time,
                        'type' => $post->type,
                        'userId' => $post->user_id,
                        'likesCount' => $post->likes_count,
                        'commentsCount' => $post->comments_count,
                        'documentName' => $post->planDetails->document->doc_name,
                        'createdAt' => $post->created_at,
                        'content' => $content,
                        'timeOnly' => $timeOnly,
                        'likes' => $likes,
                        'comments' => $comments,
                        'avatar' => $avatar,
                    ];
                case PostType::PROGRESS:
                    return [
                        'japanese_fullname' => $userName,
                        'id' => $post->id,
                        'content' => $post->content,
                        'type' => $post->type,
                        'userId' => $post->user_id,
                        'likesCount' => $post->likes_count,
                        'commentsCount' => $post->comments_count,
                        'createdAt' => $post->created_at,
                        'sub_content' => $post->sub_content,
                        'max_score' => $post->max_score,
                        'expected_score' => $post->expected_score,
                        'achieved_score' => $post->achieved_score,
                        'contest_name' => $post->contest_name,
                        'contest_date' => $post->contest_date,
                        'document_name' => $post->document_name,
                        'likes' => $likes,
                        'comments' => $comments,
                        'avatar' => $avatar,
                    ];
                default:
                    return [];
            }
        });

        return response()->json(
            [
                'data' => $responsePosts,
                'success' => true,
                'message' => 'Successfully get all posts by user id',
            ],
            200
        );
    }

    public function createType1Post(Request $request)
    {
        //Chia lai cac loai Post (61,62,... doc trong spec C1 muc 6)
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        //create Post type 0
        $validator = Validator::make($request->input(), [
            'user_id' => 'required|integer',
            'memo' => 'nullable|string|max:255',
            'real_amount' => 'required|numeric',
            'real_time' => 'numeric',
            'plan_detail_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        $newPost0 = new Post();
        $newPost0->content = strval($request->input('memo'));
        $newPost0->real_amount = doubleval($request->input('real_amount'));
        $newPost0->real_time = doubleval($request->input('real_time'));
        $newPost0->user_id = intval($request->input('user_id'));
        $newPost0->plan_detail_id = intval($request->input('plan_detail_id'));
        $newPost0->type = PostType::USERPOST;
        if ($newPost0->save()) {
            $id = $newPost0->id;
            $postsType0 = Post::with('planDetails.document.unit', 'likes', 'comments')->where('type', PostType::USERPOST)->where('id', $id)
                ->withCount('likes', 'comments')->get();
            $arr1 = $postsType0->map(function ($post) {
                $temp = strval($post->real_amount);
                $unit = $post->planDetails->document->unit->name;
                $timeOnly = false;
                if ($unit === '時間') {
                    $content = "$temp 時間";
                    $timeOnly = true;
                } else {
                    $content  = "$temp $unit";
                    if ($post->real_time !== null) {
                        $tmp = strval($post->real_time);
                        $content = "$content / $tmp 時間";
                    }
                }

                $likes = $post->likes->map((function ($like) {
                    return [
                        'user_id' => $like->id,
                        'username' => $like->japanese_fullname,
                    ];
                }));
                $comments = $post->comments->map((function ($comment) {
                    return [
                        'user_id' => $comment->id,
                        'username' => $comment->japanese_fullname,
                    ];
                }));

                return [
                    'id' => $post->id,
                    'memo' => $post->content,
                    'realAmount' => $post->real_amount,
                    'realTime' => $post->real_time,
                    'type' => $post->type,
                    'userId' => $post->user_id,
                    'likesCount' => $post->likes_count,
                    'commentsCount' => $post->comments_count,
                    'documentName' => $post->planDetails->document->doc_name,
                    'createdAt' => $post->created_at,
                    'content' => $content,
                    'timeOnly' => $timeOnly,
                    'likes' => $likes,
                    'comments' => $comments,
                ];
            });

            $post = $arr1->first();
            $user = User::find($post['userId'])->first();
            $post['japanese_fullname'] = $user->japanese_fullname;
            $post['avatar'] = $user->avatar;

            return response()->json([
                'data' => $post,
                'success' => true,
                'message' => 'Save new post type 1 success!',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Save new post type 1 failed!',
        ], 400);
    }

    public function createType2Post(Request $request)
    {
        $validator = Validator::make($request->input(), [
            'user_id' => 'required|integer',
            'content' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        $newPost2 = new Post();
        $newPost2->content = strval($request->input('content'));
        $newPost2->user_id = intval($request->input('user_id'));
        $newPost2->type = PostType::NEW_TARGET;
        $planId = $request->plan_id;
        $newPlanDetails = PlanDetail::where('plan_id', $planId)->get();

        if ($newPost2->save()) {
            $id = $newPost2->id;
            foreach ($newPlanDetails as $newPlanDetail) {
                $newSubPost = new SubPost();
                $newSubPost->post_id = $id;
                $newSubPost->sub_content = $newPlanDetail->expected_amount.''.$newPlanDetail->document->unit->name;
                $newSubPost->document_name = $newPlanDetail->document->doc_name;
                $newSubPost->type = 'planCreation';
                $newSubPost->save();
            }

            $postsType2 = Post::with('likes', 'comments')->where('type', PostType::NEW_TARGET)->where('id', $id)
                ->withCount('likes', 'comments')->get();
            $arr1 = $postsType2->map(function ($post) {
                $likes = $post->likes->map((function ($like) {
                    return [
                        'user_id' => $like->id,
                        'username' => $like->japanese_fullname,
                    ];
                }));
                $comments = $post->comments->map((function ($comment) {
                    return [
                        'user_id' => $comment->id,
                        'username' => $comment->japanese_fullname,
                    ];
                }));

                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'type' => $post->type,
                    'userId' => $post->user_id,
                    'likesCount' => $post->likes_count,
                    'commentsCount' => $post->comments_count,
                    'createdAt' => $post->created_at,
                    'likes' => $likes,
                    'comments' => $comments,
                ];
            });

            $post = $arr1->first();
            $user = User::find($post['userId'])->first();
            $post['japanese_fullname'] = $user->japanese_fullname;
            $post['avatar'] = $user->avatar;

            return response()->json([
                'data' => $post,
                'success' => true,
                'message' => 'Save new post type 2 succes!',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Save new post type 2 failed!',
        ], 400);
    }

    public function createTargetResultPost(Request $request)
    {
        $validator = Validator::make($request->input(), [
            'user_id' => 'required|integer',
            'content' => 'nullable|string|max:255',
            'success' => 'nullable|integer',
            'target_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'success' => false,
                    'message' => 'Validation Error',
                ],
                400
            );
        }

        $newPost1 = new Post();
        $newPost1->content = strval($request->input('content'));
        $newPost1->user_id = intval($request->input('user_id'));
        $newPost1->success = intval($request->input('success'));
        $newPost1->type = PostType::TARGET_RESULT;

        if ($newPost1->save()) {
            try {
                $target = Target::find(intval($request->input('target_id')));
                if ($target) {
                    foreach ($target->targetDetails as $targetDetail) {
                        $subPost = new SubPost();
                        $subPost->post_id = $newPost1->id;
                        if ($targetDetail->type === 0) {
                            $subPost->type = 'contest';
                            $expectScore = 0;
                            $resultScore = 0;
                            $subPost->max_score = $targetDetail->testContent->contest->total_score;
                            $subPost->contest_name = $targetDetail->testContent->contest->contest_name;
                            foreach ($targetDetail->testContent->scoreEachs as $score) {
                                $expectScore += $score->expected_score;
                                $resultScore += $score->result;
                            }

                            $subPost->success = $resultScore >= $expectScore ? 1 : 0;
                            $subPost->content = $newPost1->content.($subPost->success ? 'の目標を達成しました！' : 'の目標を達成しませんでした！');
                            $subPost->sub_content = ($subPost->success ? 'やった！' : '残念！');
                            $subPost->expected_score = $expectScore;
                            $subPost->achieved_score = $resultScore;
                            $subPost->save();
                        } else {
                            $subPost->sub_content = $targetDetail->freeContent->result;
                            $subPost->type = 'freeContent';
                            $subPost->success = $targetDetail->freeContent->result ? 1 : 0;
                            $subPost->content = $targetDetail->freeContent->content;
                            $subPost->save();
                        }
                    }
                }
            } catch (Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'data' => $newPost1,
                'success' => true,
                'message' => 'Save new post success!',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Save new post failed!',
        ], 400);
    }

    public function getPostById(Request $request, $postId)
    {
        //0:progress 1:plan_edit 2:target_result
        //Chia lai cac loai Post
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        $postsType0 = Post::with('planDetails.document.unit', 'likes', 'comments')->where('type', PostType::USERPOST)
            ->withCount('likes', 'comments')->where('id', $postId)->get();
        $postsType3 = Post::with('likes', 'comments')->withCount('likes', 'comments')->where('id', $postId)
            ->where('type', PostType::PROGRESS)->get();
        $postsType1 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')
            ->where('id', $postId)->where('type', PostType::TARGET_RESULT)->get();
        $postsType2 = Post::with('likes', 'comments', 'subPosts')->withCount('likes', 'comments')
            ->where('id', $postId)->where('type', PostType::NEW_TARGET)->get();

        $arr4 = $postsType2->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    'subContent' => $subPost->sub_content,
                    'documentName' => $subPost->document_name,
                    'type' => $subPost->type,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'subPosts' => $subPosts,
            ];
        });

        $arr3 = $postsType1->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            $subPosts = $post->subPosts->map((function ($subPost) {
                return [
                    'id' => $subPost->id,
                    'postId' => $subPost->post_id,
                    'content' => $subPost->content,
                    //'subContent' => $subPost->sub_content,
                    'contestName' => $subPost->contest_name,
                    'contestDate' => $subPost->contest_date,
                    'maxScore' => $subPost->max_score,
                    'expectedScore' => $subPost->expected_score,
                    'achievedScore' => $subPost->achieved_score,
                    'type' => $subPost->type,
                    'success' => $subPost->success,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'subContent' => $post->sub_content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'likes' => $likes,
                'comments' => $comments,
                'subPosts' => $subPosts,
                'createdAt' => $post->created_at,
                'success' => $post->success,
            ];
        });

        $arr1 = $postsType0->map(function ($post) {
            $temp = strval($post->real_amount);
            $unit = $post->planDetails->document->unit->name;
            $timeOnly = false;
            if ($unit === '時間') {
                $content = "$temp 時間";
                $timeOnly = true;
            } else {
                $content  = "$temp $unit";
                if ($post->real_time !== null) {
                    $tmp = strval($post->real_time);
                    $content = "$content / $tmp 時間";
                }
            }

            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'id' => $post->id,
                'memo' => $post->content,
                'realAmount' => $post->real_amount,
                'realTime' => $post->real_time,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'documentName' => $post->planDetails->document->doc_name,
                'createdAt' => $post->created_at,
                'content' => $content,
                'timeOnly' => $timeOnly,
                'likes' => $likes,
                'comments' => $comments,
            ];
        });

        $arr2 = $postsType3->map(function ($post) {
            $likes = $post->likes->map((function ($like) {
                return [
                    'user_id' => $like->id,
                    'username' => $like->japanese_fullname,
                ];
            }));

            $comments = $post->comments->map((function ($comment) {
                return [
                    'user_id' => $comment->id,
                    'username' => $comment->japanese_fullname,
                ];
            }));

            return [
                'id' => $post->id,
                'content' => $post->content,
                'type' => $post->type,
                'userId' => $post->user_id,
                'likesCount' => $post->likes_count,
                'commentsCount' => $post->comments_count,
                'createdAt' => $post->created_at,
                'sub_content' => $post->sub_content,
                'max_score' => $post->max_score,
                'expected_score' => $post->expected_score,
                'achieved_score' => $post->achieved_score,
                'contest_name' => $post->contest_name,
                'contest_date' => $post->contest_date,
                'document_name' => $post->document_name,
                'likes' => $likes,
                'comments' => $comments,
            ];
        });
        if ($arr1->count() > 0) {
            $post = $arr1->first();
        } elseif ($arr2->count() > 0) {
            $post = $arr2->first();
        } elseif ($arr3->count() > 0) {
            $post = $arr3->first();
        } elseif ($arr4->count() > 0) {
            $post = $arr4->first();
        } else {
            $post = null;
        }

        if ($post !== null) {
            $user = User::find($post['userId'])->first();
            $post['japanese_fullname'] = $user->japanese_fullname;
            $post['avatar'] = $user->avatar;

            return response()->json(
                [
                    'data' => $post,
                    'success' => true,
                    'message' => 'Successfully get all posts by user id',
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => null,
                'success' => false,
                'message' => 'No post found',
            ],
            200
        );
    }

    public function createType3Post(Request $request)
    {
        try {
            $dateOfTarget = Carbon::parse($request->date_of_target);
            $year = $dateOfTarget->year;
            $month = $dateOfTarget->month;
            if ($month <= 9) {
                $month = "0$month";
            }

            $content = $year.'/'.$month;

            //Check 25 50 75 100
            $process = (int) $request->process;
            // Neu post thong bao 25 50 75 100 cua date of target nay da tung ton tai thi ko tao them nua. Trach bi trung lap
            if ($process === 100) {
                $process = 100;
            } elseif ($process >= 75 && $process < 100) {
                $process = 75;
            } elseif ($process >= 50 && $process < 75) {
                $process = 50;
            } elseif ($process >= 25 && $process < 50) {
                $process = 25;
            } else {
                return response()->json(
                    [
                        'data' => null,
                        'success' => false,
                        'message' => 'Progress must >= 25',
                    ],
                    200
                );
            }

            $user = Auth::user();
            $tempPost = Post::where('sub_content', strval($process).'% 達成')->where('content', $content)
                ->where('user_id', $user->id)->first();
            if ($tempPost === null) {
                $subContent = strval($process).'% 達成';

                $post = new Post();
                $post->content = $content;
                $post->sub_content = $subContent;
                $post->type = 3;
                $post->user_id = $user['id'];

                $post->save();

                return response()->json(
                    [
                        'data' => $post,
                        'success' => true,
                        'message' => 'Successfully create post type 3',
                    ],
                    200
                );
            }

            return response()->json(
                [
                    'data' => null,
                    'success' => false,
                    'message' => 'Post already exist',
                ],
                200
            );
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(
                [
                    'data' => null,
                    'success' => false,
                    'message' => $th,
                ],
                500
            );
        }
    }
}
