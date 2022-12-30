<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('posts')->insert([
            [
                'content' => '',
                'real_amount' => 2,
                'real_time' => 2,
                'type' => 0,
                'target_id' => 1,
                'plan_id' => 1,
                'plan_detail_id' => 1,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'sub_content' => null,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => 'Konichiwa',
                'real_amount' => 1,
                'real_time' => 1,
                'type' => 0,
                'target_id' => 1,
                'plan_id' => 1,
                'plan_detail_id' => 2,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'sub_content' => null,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => 'Nice day',
                'real_amount' => 2,
                'real_time' => 3,
                'type' => 0,
                'target_id' => 1,
                'plan_id' => 1,
                'plan_detail_id' => 2,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'sub_content' => null,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => '2022/09', //の目標の学習計画を作成しました
                'sub_content' => null,
                'real_amount' => null,
                'real_time' => null,
                'type' => 2,
                'target_id' => null,
                'plan_id' => null,
                'plan_detail_id' => null,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => '2020/09',//目標に対して進歩がありました
                'sub_content' => '25% 達成',
                'real_amount' => null,
                'real_time' => null,
                'type' => 3,
                'target_id' => null,
                'plan_id' => null,
                'plan_detail_id' => null,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => '2020/09',//の目標を達成しました！
                'sub_content' => null,
                'type' => 1,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'target_id' => null,
                'plan_id' => null,
                'plan_detail_id' => null,
                'real_amount' => null,
                'real_time' => null,
                'document_name' => null,
                'success' => true,
            ],
            [
                'content' => 'Laravel のテストを書いています',
                'real_amount' => 10,
                'real_time' => null,
                'type' => 0,
                'target_id' => 1,
                'plan_id' => 1,
                'plan_detail_id' => 3,
                'user_id' => 1,
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
                'sub_content' => null,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'document_name' => null,
                'success' => false,
            ],
            [
                'content' => '2020/07',//の目標を達成しました！
                'sub_content' => null,
                'type' => 1,
                'contest_name' => null,
                'contest_date' => null,
                'max_score' => null,
                'expected_score' => null,
                'achieved_score' => null,
                'user_id' => 2,
                'created_at' => Carbon::parse('2020-7-1')->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::parse('2020-7-1')->format('Y-m-d H:i:s'),
                'target_id' => null,
                'plan_id' => null,
                'plan_detail_id' => null,
                'real_amount' => null,
                'real_time' => null,
                'document_name' => null,
                'success' => false,
            ],
        ]);
    }
}
