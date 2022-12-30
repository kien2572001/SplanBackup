import { useEffect, useState } from "react";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import { useRouter } from "next/router";
import C21SideBar from "~/components/layout/C21Sidebar";
import { button, Space } from "antd";
import Icon from "~/components/Icon";
import ky from "~/api/ky";
import Link from "next/link";

const Achivements = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [loadingTarget, setLoadingTarget] = useState(true);
  const [targetDetail, setTargetDetail] = useState({});
  const [userTarget, setUserTarget] = useState({});
  const [iscurrentUser, setIsCurrentUser] = useState(false);
  const [naiteiId, setNaiteiId] = useState(0);
  const [targetId, setTargetId] = useState(0);
  const caculateSum = (target) => {
    let sum = 0;
    target.test_content.score_eachs.map((data) => {
      sum += data.expected_score;
    });
    return sum;
  };
  useEffect(() => {
    const fetchData = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      let { naitei_id } = router.query;
      naitei_id = parseInt(naitei_id);
      setNaiteiId(parseInt(naitei_id));
      if (naitei_id === currentUser.id) setIsCurrentUser(true);
      const userRes = await ky
        .get(`/api/users/naiteisha?user_id=${naitei_id}`)
        .json();
      setUserInfo(userRes.data);
      try {
        setLoadingTarget(true);
        const targetRes = await ky
          .get(`/api/users/target?user_id=${naitei_id}`)
          .json();
        setUserTarget(targetRes.data);
        const targetId = targetRes.data.targetId;
        if (targetId !== null) {
          const targetDetailRes = await ky
            .get(`/api/targets/${targetId}`)
            .json();
          setTargetDetail(targetDetailRes.data.target.target_details);
          setTargetId(targetRes.data.targetId);
        }
      } catch (err) {
      } finally {
        setLoadingTarget(false);
      }
    };
    fetchData();
  }, [naiteiId, router.query]);

  return (
    <NaiteishaTopLayout userInfo={userInfo} active={"基本データ"}>
      {!loadingTarget && (
        <div className="wrapper overflow-y-auto w-full">
          <div className="bg-white my-3 rounded-[20px] pl-8 pt-8 pb-8">
            <h1 className="font-medium justify-content-center text-center">
              現在の目標
            </h1>
            <div className="grid grid-cols-12  px-8 pb-8 mt-12">
              <div className="col-span-2">
                <div className="pt-10 pb-10 font-medium text-[30px]">
                  基本データ
                </div>
                <Space direction="vertical" size="large">
                  <C21SideBar naiteiId={naiteiId} />
                </Space>
              </div>
              <view
                style={{ height: "100%", width: 1, backgroundColor: "#D9D9D9" }}
              ></view>
              <div className="col-span-9">
                <div className="flex flex-row justify-between">
                  <h3 className="mw-75">
                    マイルストーン:{" "}
                    {userTarget.completed.length !== 0
                      ? userTarget.completed[0].dateOfTarget
                          .split("-")
                          .slice(0, 2)
                          .join("/")
                      : userTarget.inCompleted.length !== 0
                      ? userTarget.inCompleted[0].dateOfTarget
                          .split("-")
                          .slice(0, 2)
                          .join("/")
                      : ""}
                  </h3>
                  {iscurrentUser && (
                    <Link
                      href={`/naitei/${naiteiId}/milestones/${targetId}/achievements/edit`}
                    >
                      <Icon
                        className="cursor-pointer"
                        name="pencil-squared"
                        color="primary"
                        size={30}
                      />
                    </Link>
                  )}
                </div>
                <div className="font-bold text-[36px]">試験</div>
                <div className="pl-10">
                  <div className="font-bold text-[30px]">言語</div>
                  {targetDetail &&
                    targetDetail.length > 0 &&
                    targetDetail.map((target) => {
                      if (
                        target.type === 0 &&
                        target.category.name.includes("言語")
                      )
                        return (
                          <div className="pl-10">
                            <div
                              className="flex items-start justify-between self-start my-2 w-full"
                              key={target.id}
                            >
                              <div>
                                <div className="flex items-center">
                                  <Icon
                                    name="target"
                                    color="primary"
                                    size={36}
                                  />
                                  <div className="pl-10 font-bold text-[30px]">
                                    {!target.type
                                      ? target.test_content.contest.contest_name
                                      : target.free_content.content}
                                  </div>
                                </div>
                              </div>
                              {target.type === 0 && (
                                <div className="flex items-center">
                                  <div className="font-bold text-[30px]">
                                    {caculateSum(target)}
                                  </div>
                                  <div className="font-bold text-[30px]">/</div>
                                  <div className="font-bold text-[30px]">
                                    {target.test_content.contest.total_score}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-[#BFBFBF] font-medium text-[18px] pl-10">
                              {target.type === 0 &&
                                target.test_content.date_of_contest
                                  .split("-")
                                  .slice(0, 2)
                                  .join("/")}
                            </div>
                            {target.type === 0 && (
                              <div>
                                {Array.from(
                                  Array(
                                    target.test_content.score_eachs.length
                                  ).keys()
                                ).map((index) => {
                                  return (
                                    <div
                                      className="flex items-start justify-between self-start my-2 w-full pl-10"
                                      key={index}
                                    >
                                      <div className="font-regular text-[24px]">
                                        {
                                          target.test_content.score_eachs[index]
                                            .part_name
                                        }
                                      </div>
                                      <div className="flex items-center">
                                        <div className="font-bold text-[24px]">
                                          {
                                            target.test_content.score_eachs[
                                              index
                                            ].expected_score
                                          }
                                        </div>
                                        <div className="font-bold text-[24px]">
                                          /
                                        </div>
                                        <div className="font-bold text-[24px]">
                                          {
                                            target.test_content.contest
                                              .contest_score_eachs[index]
                                              .max_score
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                    })}
                </div>
                <div className="pl-10">
                  <div className="font-bold text-[30px]">IT知識・技術</div>
                  {targetDetail &&
                    targetDetail.length > 0 &&
                    targetDetail.map((target) => {
                      if (target.category.name === "IT知識・技術") {
                        return (
                          <div className="pl-10">
                            <div
                              className="flex items-start justify-between self-start my-2 w-full"
                              key={target.id}
                            >
                              <div>
                                <div className="flex items-center">
                                  <Icon
                                    name="target"
                                    color="primary"
                                    size={36}
                                  />

                                  <div className="pl-10 font-bold text-[30px]">
                                    {!target.type
                                      ? target.test_content.contest.contest_name
                                      : target.free_content.content}
                                  </div>
                                </div>
                              </div>
                              {target.type === 0 && (
                                <div className="flex items-center">
                                  <div className="font-bold text-[30px]">
                                    {caculateSum(target)}
                                  </div>
                                  <div className="font-bold text-[30px]">/</div>
                                  <div className="font-bold text-[30px]">
                                    {target.test_content.contest.total_score}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-[#BFBFBF] font-medium text-[18px] pl-10">
                              {target.type === 0 &&
                                target.test_content.date_of_contest
                                  .split("-")
                                  .slice(0, 2)
                                  .join("/")}
                            </div>
                            {target.type === 0 && (
                              <div>
                                {Array.from(
                                  Array(
                                    target.test_content.score_eachs.length
                                  ).keys()
                                ).map((index) => {
                                  return (
                                    <div
                                      className="flex items-start justify-between self-start my-2 w-full pl-10"
                                      key={index}
                                    >
                                      <div className="font-regular text-[24px]">
                                        {
                                          target.test_content.score_eachs[index]
                                            .part_name
                                        }
                                      </div>
                                      <div className="flex items-center">
                                        <div className="font-bold text-[24px]">
                                          {
                                            target.test_content.score_eachs[
                                              index
                                            ].expected_score
                                          }
                                        </div>
                                        <div className="font-bold text-[24px]">
                                          /
                                        </div>
                                        <div className="font-bold text-[24px]">
                                          {target.test_content.score_eachs
                                            .length === 1
                                            ? target.test_content.score_eachs[0]
                                                .maxScore
                                            : target.test_content.contest
                                                .contest_score_eachs[index]
                                                .max_score}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                    })}
                </div>
                <div className="font-bold text-[36px]">その他</div>
                <div className="pl-10">
                  {targetDetail &&
                    targetDetail.length > 0 &&
                    targetDetail.map((target) => {
                      if (target.category.name === "その他") {
                        return (
                          <div className="pl-10">
                            <div
                              className="flex items-start justify-between self-start my-2 w-full"
                              key={target.id}
                            >
                              <div>
                                <div className="flex items-center">
                                  <Icon
                                    name="target"
                                    color="primary"
                                    size={36}
                                  />
                                  <div className="pl-10 font-bold text-[30px]">
                                    { target.free_content.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </NaiteishaTopLayout>
  );
};
export default Achivements;
