import ky from "ky";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { PlanProgress } from "~/components/C3";
import EditPlanShow from "~/components/C3/C3-5/EditPlanShow";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";

import { getMilestoneById } from "~/utils/C3/plan";
import Loading from "../Loading";

const EditPlan = ({ userData }) => {
  const router = useRouter();
  const milestoneId = parseInt(router.query.milestone_id);
  const [isLoading, setIsLoading] = useState(false);
  const [milestone, setMilestone] = useState({
    target: null,
    plan: null,
  });

  useEffect(() => {
    const callAPI = async () => {
      try {
        setIsLoading(true);
        const data = await getMilestoneById(milestoneId);
        if (!data) {
          //Need to consider more
        } else {
          setMilestone(data);
        }
      } catch (err) {
        setMilestone({ plan: null, target: null });
      } finally {
        setIsLoading(false);
      }
    };
    callAPI();
  }, [milestoneId]);

  return (
    <NaiteishaTopLayout userInfo={userData} active={"学習目標"}>
      <div className="wrapper overflow-y-auto w-full">
        <div className="bg-white my-3 mx-2 rounded-[20px] pl-8 pt-8 pb-8">
          {milestone && (
            <h2 className="mt-20 ml-16">
              {moment(milestone?.target?.date_of_target).format("YYYY/MM")}
            </h2>
          )}

          <EditPlanShow target={milestone?.target} />

          <h3 className="mb-6 text-4xl">計画進捗</h3>
          <PlanProgress type={"edit"} planData={milestone}></PlanProgress>
        </div>
      </div>

      {
        isLoading && <Loading/>
      }
    </NaiteishaTopLayout>
  );
};

export default EditPlan;
