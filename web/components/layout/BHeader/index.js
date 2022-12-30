import { Tabs } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "../../Icon";
import { getAllMilestoneByUserId } from "~/utils/C3/plan";
import { useState, useEffect } from "react";

const { TabPane } = Tabs;

const BHeader = ({ userInfo, active }) => {
  const [nextMilestone, setNextMilestone] = useState(undefined);
  useEffect(() => {
    const callAPI = async () => {
      try {
        if (userInfo && userInfo.id) {
          const milestones = await getAllMilestoneByUserId(userInfo?.id);
          if (milestones.length) {
            milestones.sort(
              (a, b) =>
                new Date(a?.date_of_target) - new Date(b?.date_of_target)
            );
            const nextMilestone = milestones.find(
              (milestone) => milestone.is_completed === 0
            );
            if (nextMilestone) {
              setNextMilestone(nextMilestone);
            } else {
              setNextMilestone(milestones.at(-1));
            }
          } else {
            setNextMilestone({ id: 1 });
          }
        }
      } catch (error) {}
    };
    callAPI();
  }, [userInfo, userInfo.id]);

  return (
    <div className="shadow-md">
      <div className="flex pt-4">
        <div className="mx-10 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-full object-fill w-[100px] h-[100px]"
            alt="avatar"
            src={
              userInfo?.avatar
                ? (userInfo.avatar.startsWith("images/") ? "/" : "") +
                  userInfo.avatar
                : defaultAvatar.src
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-default">
            {userInfo?.japaneseFullname}
          </h3>
          <div className="flex">
            <h5 className="text-default">{userInfo?.university}</h5>
            <h5 className="text-default mx-2 ">-</h5>
            <h5 className="text-default">{userInfo?.gradeCode}</h5>
          </div>
          <div className="flex">
            <h5 className="text-default">{userInfo?.company}</h5>
            <h5 className="text-default mx-2 ">-</h5>
            <h5 className="text-default">
              {userInfo?.receiveNaiteiDate &&
                moment(userInfo?.receiveNaiteiDate).format("YYYY/MM/DD")}
            </h5>
          </div>
          <div className="flex">
            <h5 className="text-default mr-2">卒業予定日:</h5>
            <h5 className="text-default">
              {userInfo?.graduationDate &&
                moment(userInfo?.graduationDate).format("YYYY/MM/DD")}
            </h5>
          </div>
        </div>
      </div>
      <div>
        <style>
          {`.ant-tabs-tab.ant-tabs-tab-active .custom-icon, .ant-tabs-tab:hover .custom-icon {
              background-color: #3DA9FC;
            }
              .custom-icon {
                transition: all .3s;
              }
            a {
              --tw-text-opacity: 1;
              color: rgb(9 64 103 / var(--tw-text-opacity));
              text-decoration: none;
            }
            `}
        </style>
        <Tabs tabPosition="bottom" defaultActiveKey={active} centered={true}>
          <TabPane
            tab={
              <Link href={`/naitei/${userInfo?.id}`}>
                <a className="w-24 flex justify-center items-center gap-1">
                  <Icon name="house" size={16} />
                  <span
                    className={active === "ホーム" ? "text-primary" : undefined}
                  >
                    ホーム
                  </span>
                </a>
              </Link>
            }
            key="ホーム"
          ></TabPane>
          <TabPane
            tab={
              <Link href={`/naitei/${userInfo?.id}/basics/targets`}>
                <a className="w-24 flex justify-center items-center gap-1 ">
                  <Icon name="info" size={16} />
                  <span
                    className={
                      active === "基本データ" ? "text-primary" : undefined
                    }
                  >
                    基本データ
                  </span>
                </a>
              </Link>
            }
            key="基本データ"
          ></TabPane>
          <TabPane
            tab={
              <Link
                href={
                  nextMilestone
                    ? {
                        pathname: `/naitei/${userInfo?.id}/milestones/${nextMilestone?.id}`,
                      }
                    : {
                        pathname: `/naitei/${userInfo?.id}/milestones`,
                      }
                }
              >
                <a className="w-24 flex justify-center items-center gap-1">
                  <Icon name="plant" size={16} />
                  <span
                    className={
                      active === "学習目標" ? "text-primary" : undefined
                    }
                  >
                    学習目標
                  </span>
                </a>
              </Link>
            }
            key="学習目標"
          ></TabPane>

          <TabPane
            tab={
              <div className="w-24 flex justify-center items-center gap-1 text-default">
                <Icon name="schedule" size={16} />
                学習統計
              </div>
            }
            key="学習統計"
          ></TabPane>
        </Tabs>
      </div>
    </div>
  );
};

BHeader.defaultProps = {
  active: "ホーム",
};

export default BHeader;
