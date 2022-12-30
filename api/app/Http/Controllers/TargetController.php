<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Contest;
use App\Models\FreeContent;
use App\Models\Plan;
use App\Models\ScoreEach;
use App\Models\Target;
use App\Models\TargetDetail;
use App\Models\TestContent;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = $request->get('userId');
            if ($userId) {
                $user = User::find($userId);
                if ($user) {
                    return response()->json([
                        'data' => $user->targets,
                        'message' => 'success',
                    ], 200);
                }
            } else {
                $target = Target::all();
                if ($target) {
                    return response()->json([
                        'data' => $target,
                        'message' => 'success',
                    ], 200);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Target not found',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function show($targetId): JsonResponse
    {
        try {
            $target = Target::find($targetId);
            if ($target) {
                $target->targetDetails;
                foreach ($target->targetDetails as $targetDetail) {
                    if ($targetDetail->type === 0) {
                        $targetDetail->testContent->scoreEachs;
                        $targetDetail->testContent->contest->contestScoreEachs;
                    } else {
                        $targetDetail->freeContent;
                    }

                    $targetDetail->category;
                }

                $plan = Plan::where('target_id', $target->id)->first();
                foreach ($plan->planDetails as $planDetail) {
                    $planDetail->document->unit;
                    $planDetail->document->category;
                }

                $targetDetails  = $target->targetDetails->map(function ($targetDetail) {
                    if ($targetDetail->type === 0) {
                        if (count($targetDetail->testContent->contest->contestScoreEachs) !== 0) {
                            $contestScoreEaches = $targetDetail->testContent->contest->contestScoreEachs->map(function ($contestScoreEach) {
                                return [
                                    'id' => $contestScoreEach->id,
                                    'part_name' => $contestScoreEach->part_name,
                                    'expected_score' => $contestScoreEach->expected_score,
                                    'max_score' => $contestScoreEach->max_score,
                                ];
                            });
                            for ($i = 0; $i < count($targetDetail->testContent->scoreEachs); $i++) {
                                $targetDetail->testContent->scoreEachs[$i]['maxScore'] = $contestScoreEaches[$i]['max_score'];
                            }
                        } else {
                            $targetDetail->testContent->scoreEachs[0]['maxScore'] = $targetDetail->testContent->contest['total_score'];
                        }
                    }

                    return $targetDetail;
                });

                $target['target_details'] = $targetDetails;

                return response()->json([
                    'data' => ['target' => $target, 'plan' => $plan],
                    'message' => 'success',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'target not found',
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $target = $request->get('target');
            //target này đã được lấy ở những bước trước, có kèm tất cả dữ liệu liên quan
            foreach ($target['target_details'] as $targetDetail) {
                if (array_key_exists('new', $targetDetail)) {
                    if ($targetDetail['type'] === 0) {
                        $newTargetDetail = TargetDetail::create([
                            'target_id' => $target['id'],
                            'category_id' => $targetDetail['category_id'],
                            'type' => 0,
                        ]);

                        $newTestContent = TestContent::create([
                            'target_detail_id' => $newTargetDetail->id,
                            'contest_id' => $targetDetail['test_content']['contest_id'],
                            'date_of_contest' => $targetDetail['test_content']['date_of_contest'],
                        ]);

                        foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                            ScoreEach::create([
                                'part_name' => $scoreEach['part_name'],
                                'expected_score' => $scoreEach['expected_score'],
                                'test_content_id' => $newTestContent->id,
                            ]);
                        }
                    } else {
                        $newTargetDetail = TargetDetail::create([
                            'target_id' => $target['id'],
                            'category_id' => $targetDetail['category_id'],
                            'type' => 1,
                        ]);
                        FreeContent::create([
                            'content' => $targetDetail['free_content']['content'],
                            'target_detail_id' => $newTargetDetail->id,
                        ]);
                    }
                } elseif (array_key_exists('delete', $targetDetail)) {
                    $tempt = TargetDetail::find($targetDetail['id']);
                    $tempt->delete();
                } else {
                    if ($targetDetail['type'] === 0) {
                        $testContent = TestContent::find($targetDetail['test_content']['id']);
                        $testContent->date_of_contest = $targetDetail['test_content']['date_of_contest'];
                        $testContent->save();
                        foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                            $tempt = ScoreEach::find($scoreEach['id']);
                            if ((int) ($tempt->expected_score) !== $scoreEach['expected_score']) {
                                $tempt->expected_score = $scoreEach['expected_score'];
                                $tempt->save();
                            } elseif ((int) ($tempt->result) !== $scoreEach['result']) {
                                $tempt->result = $scoreEach['result'];
                                $tempt->save();
                            }
                        }
                    } else {
                        $freeContent = FreeContent::find($targetDetail['free_content']['id']);
                        $freeContent->content = $targetDetail['free_content']['content'];
                        if ($freeContent->result !== $targetDetail['free_content']['result']) {
                            $freeContent->result = $targetDetail['free_content']['result'];
                        }

                        $freeContent->save();
                    }
                }

                $data = Target::find($request->target['id']);
                $data->touch();
                foreach ($data->targetDetails as $targetDetail) {
                    if ($targetDetail->type === 0) {
                        $targetDetail->testContent->scoreEachs;
                    } else {
                        $targetDetail->freeContent;
                    }
                }
            }

            return response()->json([
                'data' => $data,
                'success' => true,
                'message' => 'Target edited',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function updateFreeContent($id, $result)
    {
        $freeContent = FreeContent::find($id);
        if ($freeContent) {
            $freeContent->result = $result;
            $freeContent->save();
        }

        return $freeContent->updated_at;
    }

    public function updateScoreEach($id, $result)
    {
        $scoreEach = ScoreEach::find($id);
        if ($scoreEach) {
            $scoreEach->result = $result;
            $scoreEach->save();
        }

        return $scoreEach->updated_at;
    }

    public function updateTarget(Request $request): JsonResponse
    {
        try {
            $targetId = $request->get('id');
            $target = Target::find($targetId);
            if (!$target) {
                return response()->json([
                    'success' => false,
                    'message' => 'target is not found',
                ], 404);
            }

            $updatedAt = null;

            $targetDetails = $request->get('target_details');
            foreach ($targetDetails as $targetDetail) {
                if ($targetDetail['type'] === 0) {
                    foreach ($targetDetail['test_content']['score_eachs'] as $scoreEach) {
                        $scoreEachId = $scoreEach['id'];
                        $scoreEachResult = $scoreEach['result'];
                        $updatedAt = self::updateScoreEach($scoreEachId, $scoreEachResult);
                    }
                } else {
                    $freeText = $targetDetail['free_content'];
                    $freeTextId = $freeText['id'];
                    $resultTextResult = $freeText['result'];
                    $updatedAt = self::updateFreeContent($freeTextId, $resultTextResult);
                }
            }

            $target->updated_at = $updatedAt;
            $target->save();

            return response()->json([
                'success' => true,
                'message' => 'Update target successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function updateStatus(Request $request): JsonResponse
    {
        try {
            $targetId = $request->get('id');
            $target = Target::find($targetId);
            if (!$target) {
                return response()->json([
                    'success' => false,
                    'message' => 'target is not found',
                ], 404);
            }

            $target->is_completed = $request->get('is_completed');
            $target->save();

            return response()->json([
                'success' => true,
                'message' => 'Update status of target successfully.',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not logged in',
                ]);
            }

            $userId = Auth::user()->id;
            $newTarget = Target::create([
                'user_id' => $userId,
                'date_of_target' => $request->get('date_of_target'),
            ]);

            $targetDetails = $request->get('targets');
            foreach ($targetDetails as $targetDetail) {
                $categoryName = $targetDetail['category'];
                $category = Category::where('name', $categoryName)->first();

                $newTargetDetail = TargetDetail::create([
                    'target_id' => $newTarget->id,
                    'category_id' => $category['id'],
                    'type' => $targetDetail['type'],
                ]);

                if ($targetDetail['type'] === 0) {
                    $contestName = $targetDetail['contest_name'];
                    $contest = Contest::where('contest_name', $contestName)->first();
                    $newTestContent = TestContent::create([
                        'target_detail_id' => $newTargetDetail->id,
                        'contest_id' => $contest['id'],
                        'type' => $targetDetail['type'],
                        'date_of_contest' => $targetDetail['exam_date'],
                    ]);
                    $scoreEaches = $targetDetail['score_eaches'];
                    foreach ($scoreEaches as $scoreEach) {
                        ScoreEach::create([
                            'part_name' => $scoreEach['part_name'],
                            'expected_score' => $scoreEach['expected_score'],
                            'test_content_id' => $newTestContent->id,
                        ]);
                    }
                } else {
                    FreeContent::create([
                        'content' => $targetDetail['content'],
                        'target_detail_id' => $newTargetDetail->id,
                    ]);
                }
            }

            Plan::create([
                'user_id' => $userId,
                'target_id' => $newTarget->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Creat a target successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAllTargetDateByUserId(Request $request): JsonResponse
    {
        //CHi lay ve date_of_target phuc vu cho man C32
        try {
            $userId = $request->route('userId');
            $targets = Target::where('user_id', $userId)->get();

            $targets = $targets->map(function ($target) {
                return [
                    'id' => $target->id,
                    'dateOfTarget' => $target->date_of_target,
                    'isCompleted' => $target->is_completed,
                    'userId' => $target->user_id,
                    'createdAt' => $target->created_at,
                    'updatedAt' => $target->updated_at,
                ];
            });

            return response()->json([
                'data' => $targets,
                'success' => true,
                'message' => 'Get all target by user id successfully',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getAchivementStatus($userId)
    {
        try {
            $target = Target::where('user_id', $userId)->where('is_completed', 2)
                ->orderBy('date_of_target', 'desc')->first();
            if ($target) {
                return response()->json([
                    'data' => $target,
                    'success' => true,
                    'message' => 'Get most recent target successfully',
                ]);
            }
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'messages' => $error->getMessage(),
            ]);
        }
    }
}
