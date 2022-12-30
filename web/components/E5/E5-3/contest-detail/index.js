import { Modal } from "antd";
import { useEffect, useState } from "react";
import client from "~/api/client";
import ScoreTable from "../ScoreTable";
import SettingLayout from "~/components/layout/SettingLayout";
import PageHeader from "~/components/PageHeader";
import { useRouter } from "next/router";
export default function ContestDetail() {
  const router = useRouter();
  const { contest_id: testId } = router.query;
  const { confirm } = Modal;

  const [testInfo, setTestInfo] = useState({
    contestScoreEachs: [],
    image: "/images/contest-no-image.gif",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get(`contests/${testId}`).json();
        console.log(res);
        setTestInfo({
          ...res.data,
          contestScoreEachs: res.data.contestScoreEachs.map((item, index) => ({
            ...item,
            id: index + 1,
          })),
        });
      } catch (error) {
        //
        alert("Failed to fetch test");
      }
    };

    fetchData();
  }, [testId]);

  return (
    <div>
      <SettingLayout>
        <div>
          <PageHeader
            type="detail"
            title="試験詳細"
            onEditBtnClick={() => router.push(`/settings/exams/${testId}/edit`)}
            onBackBtnClick={() => router.push("/settings/exams")}
            // onDeleteBtnClick={async () => {
            //   confirm({
            //     title: "試験を削除しますか？",
            //     content:
            //       "試験を削除すると、試験に登録されている全ての試験結果も削除されます。",
            //     // はい　ー　　いいえ
            //     okText: "はい",
            //     okType: "danger",
            //     cancelText: "いいえ",
            //     onOk() {
            //       router.push(`/settings/exams/`);
            //       return client.delete(`contests/${testId}`).json();
            //     },
            //     onCancel() {
            //       console.log("Cancel");
            //     },
            //   });
            // }}
          />
          <div className="thumbnail-name flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                (testInfo.image.startsWith("images/") ? `/` : "") +
                testInfo.image
              }
              width={200}
              height={112.5}
              alt="#"
              style={{ objectFit: "cover" }}
            />
            <h2 className="ml-8 font-bold">{testInfo.contestName}</h2>
          </div>
          <ScoreTable test={testInfo} />
        </div>
      </SettingLayout>
    </div>
  );
}
