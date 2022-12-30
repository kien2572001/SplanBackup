import React, { useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";

const totalMaxScore = (array) => {
  //console.log("array: ", array);
  if (array.length === 1) return array[0].maxScore;
  return array.reduce(
    (previousValue, currentValue) => previousValue + currentValue.max_score,
    0
  );
};

const totalExpectedScore = (array) =>
  array.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.expected_score,
    0
  );
const totalResult = (array) => {
  console.log("array: ", array);
  return array.reduce(
    (previousValue, currentValue) => previousValue + currentValue.result,
    0
  );
};

function TestContentCard({ targetDetails, achievement = false }) {
  if (targetDetails) {
    let countTestContent = 0;
    for (let i = 0; i < targetDetails.length; i++) {
      if (targetDetails[i].type === 0) {
        countTestContent++;
      }
    }
    if (countTestContent > 0) {
      return (
        <div className="flex w-full self-start mb-5 pl-8">
          <div className="w-full">
            <h3>{targetDetails[0]?.category?.name}</h3>
            {targetDetails.map((element) => {
              if (element?.type === 0) {
                return (
                  <div
                    key={element?.id}
                    className="ml-12 text-xl mb-5 text-default"
                  >
                    <span className="font-bold flex justify-between">
                      <span>試験　：</span>
                      <span>
                        {element?.test_content?.contest?.contest_name}
                      </span>
                    </span>

                    <span className="font-bold flex justify-between">
                      <span>受験日：</span>
                      <span>
                        {moment(element?.test_content?.date_of_contest).format(
                          "YYYY/M/D"
                        )}
                      </span>
                    </span>
                    <span>
                      <span className="font-bold flex justify-between">
                        <span>
                          総合得点(
                          {totalMaxScore(element?.test_content?.score_eachs)}
                          )：
                        </span>
                        <span>
                          {achievement
                            ? totalResult(element?.test_content?.score_eachs)
                            : totalExpectedScore(
                                element?.test_content?.score_eachs
                              )}
                        </span>
                        {/* (合格点: {element?.test_content?.pass_score}) */}
                      </span>
                    </span>
                    <div className="mx-10">
                      {element?.test_content?.score_eachs.length > 1 &&
                        element?.test_content?.score_eachs.map((part) => (
                          <div key={part?.part_name}>
                            <span className="flex justify-between">
                              ・{part?.part_name}({part?.max_score})：
                              <span
                                className={
                                  achievement === false
                                    ? "text-[#8D8D8D]"
                                    : "text-primary"
                                }
                              >
                                {achievement
                                  ? part?.result
                                  : part?.expected_score}
                              </span>
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    }
  }
}

export default TestContentCard;

TestContentCard.propTypes = {
  targetDetails: PropTypes.array.isRequired,
  achievement: PropTypes.bool,
};
