<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUniversityRequest;
use App\Models\GradeCode;
use App\Models\Image;
use App\Models\University;
use App\Models\UniversityUser;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UniversityController extends Controller
{
    // Listing of university
    public function index()
    {
        $universities = University::with('gradeCodes', 'image')->get();
        $universities = $universities->map(function ($university) {
            $university->gradeCodes = $university->gradeCodes->map(function ($gradeCode) {
                return [
                    'id' => $gradeCode->id,
                    'code' => $gradeCode->code,
                ];
            });

            return [
                'id' => $university->id,
                'name' => $university->name,
                'abbreviation' => $university->abbreviation,
                'gradeCodes' => $university->gradeCodes,
                'usersCount' => $university->users_count,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Get all universities successfully',
            'data' => $universities,
        ]);
    }

    // Create new university
    public function store(StoreUniversityRequest $request)
    {
        try {
            $request->validated();

            $newUniversity = new University();
            $newUniversity->name      = $request->input('name');
            $newUniversity->abbreviation = $request->input('abbreviation');
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $extension = $image->getClientOriginalExtension();
                $imageName = time().'.'.$extension;
                $path = Storage::disk('public')->putFileAs('images', $image, $imageName);
                $image = new Image();
                if ($path) {
                    $image->img_link = 'images/'.$imageName;
                } else {
                    $image->img_link = 'images/university-no-image.png';
                }

                $image->is_thumbnail = 1;
                $image->type_id = 0;
                $image->save();
                $newUniversity->image_id = $image->id;
            }

            $newUniversity->save();

            if ($request->items) {
                $items = json_decode($request->items);
                foreach ($items as $item) {
                    $gradeCode = new GradeCode();
                    $gradeCode->code = $item->gradeCode;
                    $gradeCode->year = $item->entranceYear;
                    $newUniversity->gradeCodes()->save($gradeCode);
                }
            }

            return response()->json([
                'success' => true,
                'data'    => $newUniversity,
                'message' => 'Create contest successfull',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    // Display the specified university
    public function show($id)
    {
        try {
            $uni = University::with('gradeCodes', 'image')->where('id', $id)->first();
            $uni->gradeCodes = $uni->gradeCodes->map(function ($gradeCode) {
                return [
                    'id' => $gradeCode->id,
                    'code' => $gradeCode->code,
                    'year' => $gradeCode->year,
                ];
            });
            if ($uni->image) {
                $uni->img = $uni->image->img_link;
            }

            $university = [
                'id' => $uni->id,
                'name' => $uni->name,
                'abbreviation' => $uni->abbreviation,
                'gradeCodes' => $uni->gradeCodes,
                'image' => $uni->img,
            ];

            return response()->json([
                'success' => true,
                'data'   => $university,
                'message' => 'get information of university successfully',
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    // Update university
    public function update(StoreUniversityRequest $request, $id)
    {
        try {
            $request->validated();

            $university = University::with('gradeCodes', 'image')->where('id', $id)->first();

            $university->name      = $request->input('name');
            $university->abbreviation = $request->input('abbreviation');
            if ($request->has('image')) {
                if (is_string($request->image) && $university->image->img_link !== $request->image) {
                    if (isset($university->image)) {
                        if ($university->image->img_link !== 'images/university-no-image.png') {
                            Storage::disk('public')->delete($university->image->img_link);
                        }
                    }

                    $university->image->img_link = $request->image;
                    $university->image->save();
                } elseif (!is_string($request->image)) {
                    if (isset($university->image)) {
                        if ($university->image->img_link !== 'images/university-no-image.png') {
                            Storage::disk('public')->delete($university->image->img_link);
                        }

                        $university->image->delete();
                    }

                    $image = $request->file('image');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = time().'.'.$extension;
                    $path = Storage::disk('public')->putFileAs('images', $image, $imageName);
                    $image = new Image();
                    if ($path) {
                        $image->img_link = 'images/'.$imageName;
                    } else {
                        $image->img_link = 'images/university-no-image.png';
                    }

                    $image->is_thumbnail = 1;
                    $image->type_id = 0;
                    $image->save();
                    $university->image_id = $image->id;
                }
            } else {
                if (isset($university->image)) {
                    if ($university->image->img_link !== 'images/university-no-image.png') {
                        Storage::disk('public')->delete($university->image->img_link);
                    }
                }

                $university->image()->delete();
                $university->image_id = null;
                $university->save();
            }

            $university->save();

            if ($request->items) {
                $items = json_decode($request->items, true);
                //$items = json_decode($request->items, true);
                $university->gradeCodes()->delete();
                foreach ($items as $item) {
                    $gradeCode = new GradeCode();
                    $gradeCode->university_id = $university->id;
                    $gradeCode->code = $item['code'];
                    $gradeCode->year = $item['year'];
                    $gradeCode->save();
                }

                // $university->gradeCodes()->save($gradeCode);
            }

            //$university->update();

            return response()->json([
                'success' => true,
                'data'    => $university,

                'message' => 'Edit contest successfull',
            ], 200);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    // Delete university
    public function destroy($id)
    {
        $university = University::find($id);
        if ($university) {
            $count = UniversityUser::where('university_id', $id)->where('type', 0)->count();
            if ($count > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Have user in this university',
                    'userCount' => $count,
                ]);
            }

            if (isset($university->image)) {
                if (isset($university->image->img_link) && $university->image->img_link !== 'images/university-no-image.png') {
                    Storage::disk('public')->delete($university->image->img_link);
                }

                $university->image->delete();
            }

            $university->gradeCodes()->delete();
            $university->delete();

            return response()->json([
                'success' => true,
                'message' => 'Delete university successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Delete university failed',
        ]);
    }

    public function getUniversitiesFilterByName(Request $request)
    {
        $universities = University::with('image')->where('name', 'like', '%'.$request->name.'%')->withCount('users')
            ->orWhere('abbreviation', 'like', '%'.$request->name.'%')->paginate(6);
        $temp = $universities->getCollection();
        $temp = $temp->map(function ($university) {
            return [
                'id' => $university->id,
                'name' => $university->name,
                'abbreviation' => $university->abbreviation,
                'image' => isset($university->image) ? $university->image->img_link : null,
                'usersCount' => $university->users_count,
            ];
        });
        $sorted = $temp->sortByDesc('usersCount')->values()->all();
        $universities->setCollection(collect($sorted));

        return response()->json([
            'success' => true,
            'message' => 'Get universities by name successfully',
            'data' => $universities,
        ]);
    }
}
