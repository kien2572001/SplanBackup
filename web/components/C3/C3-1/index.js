import { Button } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlanProgress } from "~/components/C3";
import C3Achievement from "~/components/C3/C3-1/C3Achievement";
import C3FutureGoal from "~/components/C3/C3-1/C3FutureGoal";
import C3Status from "~/components/C3/C3-1/C3Status";
import Roadmap from "~/components/C3/C3-1/Roadmap";
import Icon from "~/components/Icon";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";

import { getAllMilestoneByUserId, getMilestoneById } from "~/utils/C3/plan";
import Loading from "../Loading";

class TargetDetails {
  constructor(obj) {
    this.id = obj.id;
    this.target_id = obj.target_id;
    this.category = obj.category;
    this.category_id = obj.category_id;
    this.type = obj.type;
    this.test_content =
      obj.type === 0
        ? {
            ...obj.test_content,
            contest: obj.test_content.contest,
            pass_score: obj.test_content.contest.pass_score,
            // score_eachs: obj.test_content.contest.contest_score_eachs.map(
            //   (value) => {
            //     for (let each of obj.test_content.score_eachs) {
            //       if (each.part_name === value.name) {
            //         return { ...each, max_score: value.max_score };
            //       }
            //     }
            //   }
            // ),
            score_eachs: obj.test_content.contest.contest_score_eachs.length >0 ? obj.test_content.contest.contest_score_eachs.map(
              (value) => {
                for (let each of obj.test_content.score_eachs) {
                  if (each.part_name === value.name) {
                    return { ...each, max_score: value.max_score };
                  }
                }
              }
            ):obj.test_content.score_eachs,
          }
        : null;
    this.free_content =
      obj.type === 1
        ? {
            ...obj.free_content,
            content: obj.free_content.content,
            result: obj.free_content.result,
          }
        : null;
    if (obj?.delete) {
      this.delete = obj.delete;
    } else if (obj?.new) {
      this.new = obj.new;
    }
  }
}

const NaiteishaPlan = ({ userData, currentUser }) => {
  const router = useRouter();
  const userId = userData.id;
  const [milestone, setMilestone] = useState({
    plan: null,
    target: null,
  });
  //console.log("milestone: ", milestone);
  const [allMilestone, setAllMilestone] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const changeMilestone = async (id) => {
    try {
      setIsLoading(true);

      router.push(`/naitei/${userId}/milestones/${id}`, undefined, {
        shallow: true,
      });
    } catch (err) {
      setMilestone({ target: null, plan: null });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const callAPI = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMilestoneByUserId(userId);
        if (data.length) {
          data.sort(
            (a, b) => new Date(a?.date_of_target) - new Date(b?.date_of_target)
          );
          setAllMilestone(data);
          if (router.query.milestone_id) {
            const resMilestone = await getMilestoneById(
              router.query.milestone_id
            );
            if (!resMilestone) {
              //Need to consider more
              setMilestone({ target: null, plan: null });
            } else {
              console.log("resMilestone: ", resMilestone);
              setMilestone(resMilestone);
            }
          }
        }
      } catch (err) {
        setAllMilestone([]);
        setMilestone({ target: null, plan: null });
      } finally {
        setIsLoading(false);
      }
    };
    callAPI();
  }, [router.query.milestone_id, userId]);

  return (
    <NaiteishaTopLayout userInfo={userData} active={"学習目標"}>
      <div className="wrapper overflow-y-auto w-full">
        <div className="bg-white my-3 rounded-[20px] p-8">
          <div className="flex justify-between">
            <h1 className="font-medium">学習目標</h1>
            {currentUser?.id === userData?.id && (
              <Button
                className="float-right mr-16 rounded-md"
                type="primary"
                icon={<Icon name="plus-circle" color={"white"} size={16} />}
                onClick={() =>
                  router.push(`/naitei/${userId}/milestones/register`)
                }
              >
                <span className="ml-2">目標を作成する</span>
              </Button>
            )}
          </div>

          <Roadmap
            allMilestone={allMilestone}
            handleChange={(id) => changeMilestone(id)}
            milestone={milestone}
          />
          <div className="flex w-full justify-between mt-10 justify-items-center">
            <span className="text-3xl font-bold">
              {milestone?.target
                ? moment(milestone?.target?.date_of_target).format("YYYY/MM")
                : "目標なし"}
            </span>
            <div className="">
              {milestone?.target && (
                <C3Status
                  user={currentUser}
                  target={milestone?.target}
                  handleChange={(value) => {
                    setMilestone((prev) => {
                      return {
                        ...prev,
                        target: {
                          ...prev.target,
                          is_completed: value,
                        },
                      };
                    });
                    setAllMilestone((prev) =>
                      prev.map((target) =>
                        target?.id === milestone?.target?.id
                          ? { ...target, is_completed: value }
                          : target
                      )
                    );
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex flex-row justify-center mt-10 h-fit">
            <div className="w-full flex justify-center">
              <C3FutureGoal
                target_details={
                  milestone.target
                    ? milestone?.target?.target_details.map(
                        (val) => new TargetDetails(val)
                      )
                    : []
                }
                target={milestone?.target}
                currentUser={currentUser}
              />
            </div>
            <div className="border-solid border-l-[0.25px] border-x-0 border-y-0 flex justify-center w-full">
              <C3Achievement
                target_details={
                  milestone?.target
                    ? milestone?.target?.target_details.map(
                        (val) => new TargetDetails(val)
                      )
                    : []
                }
                target={milestone?.target}
                currentUser={currentUser}
              />
            </div>
          </div>
          <div className=" mt-16 mb-24">
            <div>
              <PlanProgress
                editIcon={true}
                planData={milestone?.plan}
                isTrueNaiteisha={currentUser?.id === userData?.id}
                target_details={
                  milestone?.target
                    ? milestone?.target?.target_details.map(
                        (val) => new TargetDetails(val)
                      )
                    : []
                }
              ></PlanProgress>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </NaiteishaTopLayout>
  );
};

export default NaiteishaPlan;
