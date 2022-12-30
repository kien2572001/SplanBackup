<?php

namespace App\Http\Controllers;

use App\Enums\PostType;
use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Mail\SendPassword;
use App\Models\Comment;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Models\Like;
use App\Models\PlanDetail;
use App\Models\Post;
use App\Models\SubPost;
use App\Models\TargetDetail;
use App\Models\University;
use App\Models\UniversityUser;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function store(StoreUserRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $data = $request->validated();
            if ($data) {
                $imageName = 'images/user-no-image.png';
                if ($request->file('avatar') !== null) {
                    $image = $request->file('avatar');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = time().'.'.$extension;
                    $storage = Storage::disk('public')->put('images/'.$imageName, file_get_contents($image), 'public');
                    if ($storage) {
                        $imageName = 'images/'.$imageName;
                    }
                }

                $data['avatar'] = $imageName;
                $password = '123456';
                $data['password'] = bcrypt($password);
                $data['username'] = Str::remove(' ', $data['vietnamese_fullname']);
                $user = User::query()->create($data);

                switch ($data['role']) {
                    case UserRole::NAITEISHA:
                        UniversityUser::query()->create([
                            'user_id' => $user->id,
                            'university_id' => $data['university_id'],
                        ]);
                        CompanyUser::query()->create([
                            'user_id' => $user->id,
                            'company_id' => $data['company_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Naitesha role',
                            'data' => $user,
                        ]);
                    case UserRole::MENTOR:
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Mentor role',
                            'data' => $user,
                        ]);
                    case UserRole::TEACHER:
                        UniversityUser::query()->create([
                            'user_id' => $user->id,
                            'university_id' => $data['university_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Teacher role',
                            'data' => $user,
                        ]);
                    case UserRole::CLIENT:
                        CompanyUser::query()->create([
                            'user_id' => $user->id,
                            'company_id' => $data['company_id'],
                        ]);
                        Mail::to($data['email'])->send(new SendPassword($password, $user['email']));

                        return response()->json([
                            'success' => true,
                            'message' => 'Manager role',
                            'data' => $user,
                        ]);
                    default:
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid role',
                        ], 400);
                }
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Create user failed',
                'error' => $e,
            ], 400);
        }
    }

    public function show($userId)
    {
        try {
            $role = User::where('id', '=', $userId)->first()->role;

            //'0:admin 1:naitei 2:mentor 3:teacher 4:manager'
            if ($role === UserRole::NAITEISHA) {
                $naiteisha = User::with('universities', 'companies')->where('id', $userId)->first();

                return response()->json(
                    [
                        'data' => [
                            'username'          => $naiteisha->username,
                            'vietnamese_fullname' => $naiteisha->vietnamese_fullname,
                            'japanese_fullname'   => $naiteisha->japanese_fullname,
                            'email'              => $naiteisha->email,
                            'avatar'             => $naiteisha->avatar,
                            'grade_code'          => $naiteisha->grade_code,
                            'role'               => $naiteisha->role,
                            'university_name'    => $naiteisha->universities->first()->abbreviation,
                            'university_id'      => $naiteisha->universities->first()->id,
                            'company_name'       => $naiteisha->companies->first()->company_name,
                            'company_id'         => $naiteisha->companies->first()->id,
                            'receive_naitei_date'  => $naiteisha->receive_naitei_date,
                            'graduation_date'     => $naiteisha->graduation_date,
                        ],
                        'success' => true,
                    ],
                    200
                );
            }

            if ($role === UserRole::MENTOR) {
                $mentor = User::where('id', $userId)->first();

                return response()->json(
                    [
                        'success' => true,
                        'data'    => [
                            'username'           => $mentor->username,
                            'vietnamese_fullname' => $mentor->vietnamese_fullname,
                            'japanese_fullname'   => $mentor->japanese_fullname,
                            'email'              => $mentor->email,
                            'avatar'             => $mentor->avatar,
                            'role'               => $mentor->role,
                        ],
                    ],
                    200
                );
            }

            if ($role === UserRole::TEACHER) {
                $teacher = User::with('universities')->where('id', $userId)->first();

                return response()->json(
                    [
                        'success' => true,
                        'data'    => [
                            'username'           => $teacher->username,
                            'vietnamese_fullname' => $teacher->vietnamese_fullname,
                            'japanese_fullname'   => $teacher->japanese_fullname,
                            'role'               => $teacher->role,
                            'email'              => $teacher->email,
                            'avatar'             => $teacher->avatar,
                            'university_name'    => $teacher->universities->first()->abbreviation,
                            'university_id'      => $teacher->universities->first()->id,
                        ],
                    ],
                    200
                );
            }

            $manager = User::with('companies')->where('id', '=', $userId)->first();

            return response()->json(
                [
                    'success' => true,
                    'data'    => [
                        'username'           => $manager->username,
                        'vietnamese_fullname' => $manager->vietnamese_fullname,
                        'japanese_fullname'   => $manager->japanese_fullname,
                        'role'               => $manager->role,
                        'email'              => $manager->email,
                        'avatar'             => $manager->avatar,
                        'company_name'       => $manager->companies->first()->company_name,
                        'company_id'         => $manager->companies->first()->id,
                    ],
                ],
                200
            );
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAllPostByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'error' => $validator->errors(),
            ], 400);
        }

        $userId = $request->input('user_id');

        //0:progress 1:plan_edit 2:target_result
        //Chia lai cac loai Post
        //0 : 61,62,64 Post binh thuong cua user thong bao hoc tap hang ngay. Nguoi dung post
        //1 : 63,65 Bai kiem tra thanh cong hay that bai. Tu dong
        //2: 66 Tao ke hoach moi. Tu dong
        //3: 67 Tien do hoc tap 25 50 75 100. Tu dong
        $posts = Post::with('planDetails.document.unit', 'likes', 'comments')
            ->withCount('likes', 'comments')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        $user = User::find($userId)->first();
        $userName = $user->japanese_fullname;
        $avatar = $user->avatar;

        $responsePosts = $posts->map(function ($post) use ($userName, $avatar) {
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

    public function getThisMonthTargetByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->input('user_id');
        $time = now();

        $freeContentTarget = TargetDetail::with('target', 'freeContent', 'category')->whereHas('target', function (Builder $query) use ($time, $userId) {
            $query->where('user_id', $userId)->whereMonth('date_of_target', $time->month)->whereYear('date_of_target', $time->year);
        })->where('type', 1)->get();
        $testContentTarget = TargetDetail::with('target', 'testContent.contest.contestScoreEachs', 'testContent.scoreEachs', 'category')
            ->whereHas('target', function (Builder $query) use ($time, $userId) {
                $query->where('user_id', $userId)->whereMonth('date_of_target', $time->month)->whereYear('date_of_target', $time->year);
            })->where('type', 0)->get();

        $freeContentTarget = $freeContentTarget->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'categoryName' => $item->category->name,
                'categoryId' => $item->category->id,
                'content' => $item->freeContent->content,
                'dateOfTarget' => $item->target->date_of_target,
                'checkDone' => $item->freeContent->result === 'done',
            ];
        });

        $testContentTarget = $testContentTarget->map(function ($item) {
            $expectedScore = $item->testContent->scoreEachs->sum('expected_score');
            $actualScore = $item->testContent->scoreEachs->sum('result');
            $maxScore = $item->testContent->contest->contestScoreEachs->sum('max_score');
            $contestName = $item->testContent->contest->contest_name;
            if ($maxScore === 0) {
                $maxScore = $item->testContent->contest['total_score'];
            }

            return [
                'id' => $item->id,
                'type' => $item->type,
                'targetId' => $item->target_id,
                'categoryName' => $item->category->name,
                'categoryId' => $item->category->id,
                'content' => $item->testContent->content,
                'dateOfTarget' => $item->created_at,
                'checkDone' => $actualScore >= $expectedScore,
                'expectedScore' => $expectedScore,
                'actualScore' => $actualScore,
                'maxScore' => $maxScore,
                'contestName' => $contestName,
            ];
        });

        $completedTestContentTarget = $testContentTarget->filter(function ($item) {
            return $item['checkDone'];
        });

        $inCompletedTestContentTarget = $testContentTarget->filter(function ($item) {
            return $item['checkDone'] === false;
        });

        $completedFreeContentTarget = $freeContentTarget->filter(function ($item) {
            return $item['checkDone'];
        });

        $inCompletedFreeContentTarget = $freeContentTarget->filter(function ($item) {
            return $item['checkDone'] === false;
        });
        $completed = $completedTestContentTarget->merge($completedFreeContentTarget);
        $inCompleted = $inCompletedTestContentTarget->merge($inCompletedFreeContentTarget);
        if (count($testContentTarget) > 0) {
            $targetId = $testContentTarget[0]['targetId'];
        } else {
            $targetId = null;
        }

        return response()->json(
            [
                'data' => [
                    'completed' => $completed,
                    'inCompleted' => $inCompleted,
                    'targetId'  => $targetId,
                ],
                'message' => 'Successfully get this month target by user id',
                'success' => true,
            ],
            200
        );
    }

    public function getLastestCompletedTarget(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->input('user_id');

        $target = User::find($userId)->targets()->where('is_completed', 2)
            ->orderBy('date_of_target', 'desc')->first();
        if ($target) {
            $testContentTarget = $target->targetDetails()->where('type', 0)->get();
            $testContentTarget = $testContentTarget->map(function ($item) {
                $expectedScore = $item->testContent->scoreEachs->sum('expected_score');
                $actualScore = $item->testContent->scoreEachs->sum('result');
                $maxScore = $item->testContent->contest->contestScoreEachs->sum('max_score');
                $contestName = $item->testContent->contest->contest_name;

                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'targetId' => $item->target_id,
                    'categoryName' => $item->category->name,
                    'expectedScore' => $expectedScore,
                    'content' => $item->testContent->content,
                    'actualScore' => $actualScore,
                    'maxScore' => $maxScore,
                    'contestName' => $contestName,
                    'dateOfTarget' => $item->target->date_of_target,
                ];
            });
            $freeContentTarget = $target->targetDetails()->where('type', 1)->get();
            $freeContentTarget = $freeContentTarget->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'categoryName' => $item->category->name,
                    'categoryId' => $item->category->id,
                    'content' => $item->freeContent->content,
                    'dateOfTarget' => $item->target->date_of_target,
                ];
            });
            $lastestCompletedTarget = [];
            foreach ($freeContentTarget as $item) {
                array_push($lastestCompletedTarget, $item);
            }

            foreach ($testContentTarget as $item) {
                array_push($lastestCompletedTarget, $item);
            }

            return response()->json(
                [
                    'data' => [
                        'target' => $lastestCompletedTarget ,
                    ],
                    'message' => 'Successfully get lastest completed achievement',
                    'success' => true,
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => [
                    'target' => [],
                ],
                'message' => 'Failed get lastest completed achievement',
                'success' => true,
            ],
            200
        );
    }

    public function findNaiteishaByNameFilterByCompanyAndGraduationYear(Request $request)
    {
        // param: name,company,graduation_year
        $validator = Validator::make($request->input(), [
            'name' => 'string|max:64',
            'company_id' => 'integer',
            'university_id' => 'integer',
            'graduation_year' => 'integer|min:1900|max:2100',
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

        if (!$request->has('name')) {
            $naiteishas = User::with('companies')->role(UserRole::NAITEISHA)->graduationYear($request)->get();
        } else {
            $name = $request->input('name');
            $naiteishas = User::with('companies')->where('vietnamese_fullname', 'like', '%'.$name.'%')
                ->orWhere('japanese_fullname', 'like', '%'.$name.'%')
                ->role(UserRole::NAITEISHA)->graduationYear($request)->get();
        }

        $data = $naiteishas->map(function ($naiteisha) {
            return [
                'id' => $naiteisha->id,
                'username' => $naiteisha->username,
                'vietnameseFullname' => $naiteisha->vietnamese_fullname,
                'japaneseFullname' => $naiteisha->japanese_fullname,
                'avatar' => $naiteisha->avatar,
                'gradeCode' => $naiteisha->grade_code,
                'receiveNaiteiDate' => $naiteisha->receive_naitei_date,
                'graduationDate' => $naiteisha->graduation_date,
                'companyName' => $naiteisha->companies->first()->company_name,
                'companyId' => $naiteisha->companies->first()->id,
                'universityName' => $naiteisha->universities->first()->name,
                'universityId' => $naiteisha->universities->first()->id,
            ];
        });

        if (Auth::check()) {
            $role = Auth::user()->role;
            if ($role === UserRole::CLIENT || $role === UserRole::NAITEISHA) {
                $companyName = User::with('companies')->find(Auth::id())->companies->first()->company_name;
                $data = $data->filter(function ($item) use ($companyName) {
                    return $item['companyName'] === $companyName;
                });
            }
        }

        if ($request->has('university_id')) {
            $data = $data->filter(function ($item) use ($request) {
                return $item['universityId'] === intval($request->input('university_id'));
            });
        }

        if ($request->has('company_id')) {
            $data = $data->filter(function ($item) use ($request) {
                return $item['companyId'] === intval($request->input('company_id'));
            });
        }

        $graduated = $data->filter(function ($item) {
            return $item['graduationDate'] < Carbon::now();
        });
        $undergraduated = $data->filter(function ($item) {
            return $item['graduationDate'] >= Carbon::now();
        });

        $undergraduated = $undergraduated->sortByDesc('graduationDate');

        $graduated = $graduated->sortBy('graduationDate');

        $data = $undergraduated->merge($graduated);

        return response()->json(
            [
                'data' => $data,
                'success' => true,
                'message' => 'Successfully get all naiteisha by name filter by company and graduation year',
            ],
            200
        );
    }

    public function getCompanyNameByCurrentUser()
    {
        if (Auth::check()) {
            $role = Auth::user()->role;
            if ($role === UserRole::CLIENT || $role === UserRole::NAITEISHA) {
                $companyName = User::with('companies')->find(Auth::id())->companies->first()->company_name;

                return response()->json(
                    [
                        'companyName' => $companyName,
                        'success' => true,
                        'message' => 'Successfully get company name by current user',
                    ],
                    200
                );
            }

            return response()->json(
                [
                    'companyName' => null,
                    'success' => true,
                    'message' => 'Successfully get company name by current user',
                ],
                200
            );
        }
    }

    public function getNaiteishaInfoByUserId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'message' => $validator->errors()->first(),
                    'success' => false,
                ],
                400
            );
        }

        $userId = $request->input('user_id');
        $naiteishas = User::with('universities', 'companies')->where('id', $userId)->role(UserRole::NAITEISHA)->get();

        $data = $naiteishas->map(function ($naiteisha) {
            return [
                'id' => $naiteisha->id,
                'username' => $naiteisha->username,
                'vietnameseFullname' => $naiteisha->vietnamese_fullname,
                'japaneseFullname' => $naiteisha->japanese_fullname,
                'avatar' => $naiteisha->avatar,
                'gradeCode' => $naiteisha->grade_code,
                'university' => $naiteisha->universities->first()->name,
                'company' => $naiteisha->companies->first()->company_name,
                'receiveNaiteiDate' => $naiteisha->receive_naitei_date,
                'gradeCode' => $naiteisha->grade_code,
                'graduationDate' => $naiteisha->graduation_date,
                'role' => $naiteisha->role,
            ];
        });

        return response()->json(
            [
                'data' => $data->first(),
                'success' => true,
            ],
            200
        );
    }

    public function getAllTargetDetailForC1CreatePostModal(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'data' => $validator->errors(),
                    'message' => $validator->errors()->first(),
                    'success' => false,
                ],
                400
            );
        }

        $userId = $request->input('user_id');
        $targetDetails = PlanDetail::with('document.unit')->whereHas('plan', function (Builder $query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        $arr = $targetDetails->map(function ($item) {
            return [
                'id' => $item->id,
                'expected_amount' => $item->expected_amount,
                'real_amount' => $item->real_amount,
                'doc_id' => $item->doc_id,
                'doc_name' => $item->document->doc_name,
                'unit' => $item->document->unit->name,
                'unit_id' => $item->document->unit->id,
            ];
        });

        return response()->json(
            [
                'data' => $arr,
                'success' => true,
            ],
            200
        );
    }

    public function getAllUserByUserType(Request $request, $userType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:64',
            'company_id' => 'string|max:64',
            'university_id' => 'integer',
            'grade_code' => 'string',
            'graduation_date' => 'date',
            'receive_naitei_date' => 'date',
            'graduation_year' => 'integer|min:1900|max:2100',
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

        //'0:admin 1:naitei 2:mentor 3:teacher 4:manager'
        if ($userType === 'naiteisha' || $userType === 'mentors' || $userType === 'teachers' || $userType === 'clients') {
            if ($userType === 'naiteisha') {
                $users = User::with('companies', 'universities')->name($request)->role(UserRole::NAITEISHA)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'gradeCode' => $user->grade_code,
                        'university' => $user->universities->first()->name,
                        'abbreviation' => $user->universities->first()->abbreviation,
                        'company' => $user->companies->first()->company_name,
                        'receiveNaiteiDate' => $user->receive_naitei_date,
                        'graduationDate' => $user->graduation_date,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'mentors') {
                $users = User::role(UserRole::MENTOR)->name($request)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'teachers') {
                $users = User::with('universities')->name($request)->role(UserRole::TEACHER)->orderBy('created_at', 'desc')->paginate(12);
                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'university' => $user->universities->first()->name,
                        'abbreviation' => $user->universities->first()->abbreviation,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            } elseif ($userType === 'clients') {
                $users = User::with('companies')->name($request)->role(UserRole::CLIENT)->orderBy('created_at', 'desc')->paginate(12);

                $temp = $users->getCollection();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'company' => $user->companies->first()->company_name,
                        'role' => $user->role,
                    ];
                });
                $users->setCollection($temp);
            }

            $temp = $users->getCollection();

            if ($request->has('graduation_year')) {
                $temp = User::with('companies')
                    ->role(UserRole::NAITEISHA)->graduationYear($request)->get();
                $temp = $temp->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'vietnameseFullname' => $user->vietnamese_fullname,
                        'japaneseFullname' => $user->japanese_fullname,
                        'avatar' => $user->avatar,
                        'gradeCode' => $user->grade_code,
                        'university' => $user->universities->first()->name,
                        'abbreviation' => $user->universities->first()->abbreviation,
                        'company' => $user->companies->first()->company_name,
                        'receiveNaiteiDate' => $user->receive_naitei_date,
                        'graduationDate' => $user->graduation_date,
                        'role' => $user->role,
                    ];
                });
            }

            if ($request->has('company_id')) {
                $companyName  = Company::find($request->input('company_id'))->company_name;
                $temp = $temp->filter(function ($user) use ($companyName) {
                    return $user['company'] === $companyName;
                });
            }

            if ($request->has('university_id')) {
                $universityName  = University::find($request->input('university_id'))->name;
                $temp = $temp->filter(function ($user) use ($universityName) {
                    return $user['university'] === $universityName;
                });
            }

            if ($request->has('grade_code')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['gradeCode'] === $request->input('grade_code');
                });
            }

            if ($request->has('graduation_date')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['graduationDate'] === $request->input('graduation_date');
                });
            }

            if ($request->has('receive_naitei_date')) {
                $temp = $temp->filter(function ($user) use ($request) {
                    return $user['receiveNaiteiDate'] === $request->input('receive_naitei_date');
                });
            }

            $collection = new Collection();
            foreach ($temp as $item) {
                $collection->push($item);
            }

            $users->setCollection($collection);

            return response()->json(
                [
                    'data' => $users,
                    'success' => true,
                    'message' => 'Successfully get all user by user type',
                ],
                200
            );
        }

        return response()->json(
            [
                'data' => [],
                'success' => false,
                'message' => 'User type is not valid',
            ],
            400
        );
    }

    public function updateInformationUser(Request $request, $userId)
    {
        try {
            $role = $request->role;
            $university = UniversityUser::query()->where('user_id', $userId)->first();
            $company = CompanyUser::query()->where('user_id', $userId)->first();
            $user = User::find($userId);
            if ($request->file('avatar') !== null) {
                if ($user->avatar) {
                    if ($user->avatar !== 'images/user-no-image.png') {
                        Storage::disk('public')->delete($user->avatar);
                    }
                }

                $image = $request->file('avatar');
                $extension = $image->getClientOriginalExtension();
                $imageName = time().'.'.$extension;
                $storage = Storage::disk('public')->putFileAs('images', $image, $imageName);
                if ($storage) {
                    $imageName = 'images/'.$imageName;
                } else {
                    $imageName = 'images/user-no-image.png';
                }
            } else {
                if ($request->avatar !== 'null') {
                    $imageName = $request->avatar;
                } else {
                    $imageName = null;
                    if ($user->avatar) {
                        Storage::disk('public')->delete($user->avatar);
                    }
                }
            }

            if ((int) $role === UserRole::NAITEISHA) {
                $naiteisha = User::query()->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'company_id'         => 'required',
                    'university_id'      => 'required',
                    'grade_code'         => 'required|string',
                    'receive_naitei_date' => 'required|date',
                    'graduation_date'    => 'required|date',
                    'role'               => 'required',
                ]);
                if ($validator->fails()) {
                    return response()->json(
                        [
                            'data' => $validator->errors(),
                            'message' => $validator->errors()->first(),
                            'success' => false,
                        ],
                        400
                    );
                }

                $naiteisha->vietnamese_fullname = $request->input('vietnamese_fullname');
                $naiteisha->japanese_fullname   = $request->input('japanese_fullname');
                $naiteisha->email               = $request->input('email');
                $naiteisha->grade_code          = $request->input('grade_code');
                $naiteisha->receive_naitei_date = $request->input('receive_naitei_date');
                $naiteisha->graduation_date     = $request->input('graduation_date');
                $naiteisha->role                = $request->input('role');
                $naiteisha->avatar = $imageName;
                $naiteisha->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $naiteisha->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                if ($company) {
                    $company->company_id = $request->input('company_id');
                    $company->save();
                } else {
                    CompanyUser::query()->create([
                        'user_id' => $naiteisha->id,
                        'company_id' => $request->input('company_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ((int) $role === UserRole::MENTOR) {
                $mentor = User::query()->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                ]);
                if ($validator->fails()) {
                    return response()->json(
                        [
                            'data'    => $validator->errors(),
                            'message' => $validator->errors()->first(),
                            'success' => false,
                        ],
                        400
                    );
                }

                $mentor->vietnamese_fullname = $request->input('vietnamese_fullname');
                $mentor->japanese_fullname   = $request->input('japanese_fullname');
                $mentor->email               = $request->input('email');
                $mentor->avatar = $imageName;
                $mentor->save();

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ((int) $role === UserRole::TEACHER) {
                $teacher = User::with('universities')->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'university_id'      => 'required',
                    'role'               => 'required',
                ]);
                if ($validator->fails()) {
                    return response()->json(
                        [
                            'data'    => $validator->errors(),
                            'message' => $validator->errors()->first(),
                            'success' => false,
                        ],
                        400
                    );
                }

                $teacher->vietnamese_fullname = $request->input('vietnamese_fullname');
                $teacher->japanese_fullname   = $request->input('japanese_fullname');
                $teacher->email               = $request->input('email');
                $teacher->role                = $request->input('role');
                $teacher->avatar = $imageName;
                $teacher->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $teacher->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            if ((int) $role === UserRole::CLIENT) {
                $manager = User::with('companies')->where('id', $userId)->first();
                $validator = Validator::make($request->all(), [
                    'email'              => 'required|email',
                    'company_id'         => 'required',
                    'role'               => 'required',
                ]);
                if ($validator->fails()) {
                    return response()->json(
                        [
                            'data'    => $validator->errors(),
                            'message' => $validator->errors()->first(),
                            'success' => false,
                        ],
                        400
                    );
                }

                $manager->vietnamese_fullname = $request->input('vietnamese_fullname');
                $manager->japanese_fullname   = $request->input('japanese_fullname');
                $manager->email               = $request->input('email');
                $manager->role                = $request->input('role');
                $manager->avatar = $imageName;
                $manager->save();
                if ($university) {
                    $university->university_id = $request->input('university_id');
                    $university->save();
                } else {
                    UniversityUser::query()->create([
                        'user_id' => $manager->id,
                        'university_id' => $request->input('university_id'),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'update information successfully',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'update information failed',
            ], 400);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function destroy($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json([
                    'message' => 'User not found',
                    'success' => false,
                ], 404);
            }

            if ($user->avatar) {
                if ($user->avatar !== 'images/user-no-image.png') {
                    Storage::disk('public')->delete($user->avatar);
                }
            }

            if ($user->universities) {
                $user->universities()->detach();
            }

            UniversityUser::where('user_id', $userId)->where('type', 0)->delete();
            CompanyUser::where('user_id', $userId)->where('type', 0)->delete();
            User::destroy($userId);

            Like::where('user_id', $userId)->delete();
            Comment::where('user_id', $userId)->delete();
            $posts = Post::where('user_id', $userId)->get();
            foreach ($posts as $post) {
                Like::where('post_id', $post->id)->delete();
                Comment::where('post_id', $post->id)->delete();
                SubPost::where('post_id', $post->id)->delete();
                $post->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getFirstAvailableNaiteishaId(Request $request)
    {
        $authentication = Auth::user();
        $role = $authentication->role;
        $userId = $authentication->id;
        $user = User::with('companies', 'universities')->where('id', $userId)->first();
        try {
            if ((int) $role === UserRole::NAITEISHA) {
                $user = User::where('role', UserRole::NAITEISHA)->first();

                return response()->json([
                    'success' => true,
                    'id' => $userId,
                    'message' => 'Get naiteisha id successfully',
                ]);
            }

            if ((int) $role === UserRole::MENTOR) {
                $user = User::where('role', UserRole::NAITEISHA)->first();

                return response()->json([
                    'success' => true,
                    'id' => $user->id,
                    'message' => 'Get naiteisha id successfully',
                ]);
            }

            if ((int) $role === UserRole::CLIENT) {
                $naiteisha = User::with('companies')->where('role', UserRole::NAITEISHA)->whereHas('companies', function (Builder $query) use ($user) {
                    $query->where('company_name', '=', $user->companies[0]->company_name);
                })->first();

                return response()->json([
                    'success' => true,
                    'id' => $naiteisha->id,
                    'data' => $naiteisha,
                    'message' => 'Get naiteisha id successfully',
                ]);
            }

            if ((int) $role === UserRole::TEACHER) {
                $naiteisha = User::with('universities')->where('role', UserRole::NAITEISHA)->whereHas('universities', function (Builder $query) use ($user) {
                    $query->where('name', '=', $user->universities[0]->name);
                })->first();

                return response()->json([
                    'success' => true,
                    'id' => $naiteisha->id,
                    'data' => $naiteisha,
                    'message' => 'Get naiteisha id successfully',
                ]);
            }
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ], 400);
        }
    }
}
