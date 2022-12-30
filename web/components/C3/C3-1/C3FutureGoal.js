import Link from "next/link";
import React, { useEffect, useState } from "react";
import Icon from "/components/Icon";
import PropTypes from "prop-types";
import TestContentCard from "./TestContentCard";
import FreeContentCard from "./FreeContentCard";
import { useRouter } from "next/router";

const C3FutureGoal = ({ target_details, target, currentUser }) => {
  const [targetDetailsCategories, setTargetDetailsCategories] = useState({});
  const router = useRouter();

  useEffect(() => {
    const parseData = () => {
      try {
        const newObject = target_details.reduce((r, a) => {
          r[a.category.name] = [...(r[a.category.name] || []), a];
          return r;
        }, {});
        setTargetDetailsCategories(newObject);
      } catch (err) {
        setTargetDetailsCategories({});
      }
    };
    parseData();
    //console.log("target_details", target_details);
  }, [target_details]);

  if (Object.keys(targetDetailsCategories).length) {
    return (
      <div className="w-full px-8 flex flex-col items-center py-4 bg-white mb-2">
        <div className="  relative w-full">
          <div className="text-default text-4xl font-bold	w-full text-center">
            目標
          </div>
          <div className="flex mb-4 text-primary justify-end w-full absolute top-0 right-0">
            {target?.user_id === currentUser?.id && (
              <Link
                href={`/naitei/${router.query?.naitei_id}/milestones/${target?.id}/targets/edit`}
              >
                <div className="cursor-pointer flex">
                  <Icon name="pencil-squared" color="primary" size={20} />
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 mt-2">
          <div className="w-full text-3xl font-bold">試験</div>
          {Object.keys(targetDetailsCategories).map((key) => {
            return (
              <TestContentCard
                key={key}
                targetDetails={targetDetailsCategories[key]}
              />
            );
          })}
          <div className="w-full text-3xl font-bold">その他</div>
          {Object.keys(targetDetailsCategories).map((key) => {
            return (
              <FreeContentCard
                key={key}
                targetDetails={targetDetailsCategories[key]}
              />
            );
          })}
        </div>
      </div>
    );
  } else if (target_details.length === 0) {
    return (
      <div className="w-full px-8 flex flex-col items-center py-4 bg-white mb-2 min-h-[500px]">
        <div className="flex mb-4 text-primary justify-end w-full">
          {target?.user_id === currentUser?.id && (
            <Link
              href={`/naitei/${router.query?.naitei_id}/milestones/${target?.id}/targets/edit`}
            >
              <div className="cursor-pointer flex">
                <Icon name="pencil-squared" color="primary" size={20} />
              </div>
            </Link>
          )}
        </div>
        <div className="text-xl">...</div>
      </div>
    );
  }
};

C3FutureGoal.propTypes = {
  target_details: PropTypes.array,
  target: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
};
export default C3FutureGoal;
