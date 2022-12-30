<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContestController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebInit;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/web-init', WebInit::class);


//Target info
Route::resource('targets', TargetController::class)->except([
    'create',
    'edit',
    'destroy',
]);
Route::group(['prefix' => 'targets'], function () {
    Route::get('/date-of-target/{userId}', [TargetController::class, 'getAllTargetDateByUserId']);
    Route::post('/update-result', [TargetController::class, 'updateTarget']);
    Route::post('/update-status', [TargetController::class, 'updateStatus']);
    Route::get('/achivement-status/{userId}', [TargetController::class, 'getAchivementStatus']);
});

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

//Document API
// Route::post('/document/create', [DocumentController::class, 'createDocument']);
// Route::post('/document/edit', [DocumentController::class, 'editDocument']);
// Route::delete('/document/delete/{docId}', [DocumentController::class, 'deleteDocument']);
// Route::get('/document/get-all', [DocumentController::class, 'searchDocsWithoutPaginate']);
// Route::get('/document/get-by-search', [DocumentController::class, 'searchDocs']);
// Route::get('/document/get-by-id/{id}', [DocumentController::class, 'getDocById']);

Route::group(['prefix' => 'document'], function () {
    Route::get('/get-by-search', [DocumentController::class, 'searchDocs']);
});
Route::apiResource('document', DocumentController::class);

//GetAll
Route::get('/companies', [CompanyController::class, 'getAllCompanies']);
Route::get('/universities', [UniversityController::class, 'getAllUniversity']);

//B1
Route::get('/posts', [PostController::class, 'getAllPosts']);


//C1

Route::post('/posts/create-post/', [PostController::class, 'createType1Post']);
Route::post('/posts/createtype2-post/', [PostController::class, 'createType2Post']);
Route::post('/posts/create-target-result-post/', [PostController::class, 'createTargetResultPost']);
//Post Api
Route::post('/toggle-like', [LikeController::class, 'toggleLike']);
Route::resource('posts.comments', CommentController::class)->shallow();
Route::post('/comments/update/{commentId}', [CommentController::class, 'updatePost']);
Route::group(['middleware' => ['auth:sanctum']], function () {
    //C11
});

//A1
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/logout', [AuthController::class, 'logout']);

//E11

//Route::get('/category/get-all-contests', [CategoryController::class, 'getAllTargetCategories']);

//C3-editplan
Route::post('/plan/edit', [PlanController::class, 'editPlan']);
Route::post('/post/create-type-3', [PostController::class, 'createType3Post']);


//E1-2

//Category
Route::get('/categories', [CategoryController::class, 'getAllCategories']);

//Unit
Route::get('/unit/get-all', [UnitController::class, 'getAllUnits']);

//E13

Route::resource('contests', ContestController::class)->except([
    'edit',
    'create',
]);
Route::group(['prefix' => 'contests'], function () {
    Route::post('/filter', [ContestController::class, 'searchContestsFilterByNameAndCategory']);
});


//E3
Route::group(['prefix' => 'universities'], function () {
    Route::get('/filter', [UniversityController::class, 'getUniversitiesFilterByName']);
});
Route::apiResource('universities', UniversityController::class);


//UserController
// Route::get('/user/posts', [UserController::class, 'getAllPostByUserId']);
// Route::get('/user/target', [UserController::class, 'getThisMonthTargetByUserId']);
// Route::get('/user/naiteishas', [UserController::class, 'findNaiteishaByNameFilterByCompanyAndGraduationYear']);
// Route::get('/user/plan-details/', [UserController::class, 'getAllTargetDetailForC1CreatePostModal']);
// Route::get('/user/naiteisha', [UserController::class, 'getNaiteishaInfoByUserId']);
// Route::get('user/user-type/{userType}', [UserController::class, 'getAllUserByUserType']);
// Route::post('/user/create-user', [UserController::class, 'createUser']);
// Route::get('/user/detail', [UserController::class, 'informationUser']);
// Route::post('/user/detail/{userId}', [UserController::class, 'updateInformationUser']);
// Route::delete('/user/delete/{userId}', [UserController::class, 'deleteUserByUserId']);

Route::group(['prefix' => 'users'], function () {
    Route::get('/posts/{postId}', [PostController::class, 'getPostById']);
    Route::get('/get-inf', [CompanyController::class, 'getAllCompaniesUniversities']);
    Route::get('/posts', [UserController::class, 'getAllPostByUserId']);
    Route::get('/target', [UserController::class, 'getThisMonthTargetByUserId']);
    Route::get('/naiteishas', [UserController::class, 'findNaiteishaByNameFilterByCompanyAndGraduationYear']);
    Route::get('/company', [UserController::class, 'getCompanyNameByCurrentUser']);
    Route::get('/plan-details', [UserController::class, 'getAllTargetDetailForC1CreatePostModal']);
    Route::get('/naiteisha', [UserController::class, 'getNaiteishaInfoByUserId']);
    Route::get('/user-type/{userType}', [UserController::class, 'getAllUserByUserType']);
    Route::post('/{userId}', [UserController::class, 'updateInformationUser']);
    Route::get('/target/lastest', [UserController::class, 'getLastestCompletedTarget']);
});
Route::apiResource('users', UserController::class);

//Upload file
Route::post('/upload', [UploadController::class, 'uploadImage']);
Route::get('/upload', [UploadController::class, 'getAllImages']);
Route::get('/upload/delete-by-name', [UploadController::class, 'deleteByName']);

//getfirstavailablenaiteishaid
Route::get('/naiteishas/first-available-id', [UserController::class, 'getFirstAvailableNaiteishaId']);
