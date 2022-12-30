import React, { useEffect, useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import Icon from "../../Icon";
import whitePin from "~/assets/icons/roadmap-whitepin.svg";
import defaultPin from "~/assets/icons/roadmap-defaultpin.svg";
import walking from "~/assets/icons/roadmap-walking.svg";

const iconName = {
  walking: "walking",
  flag: "roadmap-flag",
};

const Roadmap = ({ allMilestone, handleChange, milestone }) => {
  const [nextMilestone, setNextMilestone] = useState(undefined);

  useEffect(() => {
    const milestone = allMilestone.find(
      milestone => milestone.is_completed === 0
    );
    if (milestone) {
      setNextMilestone(milestone);
    } else {
      setNextMilestone(allMilestone.at(-1));
    }
  }, [allMilestone]);

  if (allMilestone.length) {
    return (
      <div className="w-full h-auto mx-auto mt-14 bg-roadmap pt-[36.8513%] relative overflow-x-auto">
        <div className="grid grid-flow-col min-h-[64px] gap-0 w-fit mx-auto absolute bottom-[28%] left-0 right-0">
          {allMilestone.map((val, index) => {
            if (index !== allMilestone.length - 1) {
              if (val.id == nextMilestone?.id) {
                return (
                  <div
                    key={val.id}
                    className="flex justify-center items-end min-w-[126px]"
                  >
                    <div className="flex justify-center flex-col">
                      {/* <Icon
                          name={iconName.walking}
                          color="white"
                          size={50}
                          className="mb-2"
                        /> */}
                      <Image alt={""} src={walking} width={36} height={57} />
                      <a
                        className="flex justify-center w-[50px] h-[40px] items-end"
                        onClick={() => {
                          if (val.id === milestone?.target?.id) {
                            return;
                          } else {
                            handleChange(val.id);
                          }
                        }}
                      >
                        <Image
                          alt={""}
                          src={val.is_completed === 2 ? whitePin : defaultPin}
                          width={val.id === milestone?.target?.id ? 32 : 24}
                          height={val.id === milestone?.target?.id ? 44 : 32}
                        />
                      </a>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={val.id}
                    className="flex justify-center items-end min-w-[126px]"
                  >
                    <a
                      className="w-[50px] h-[40px] flex items-end justify-center"
                      onClick={() => {
                        if (val.id === milestone?.target?.id) {
                          return;
                        } else {
                          handleChange(val.id);
                        }
                      }}
                    >
                      <Image
                        alt={""}
                        src={val.is_completed === 2 ? whitePin : defaultPin}
                        width={val.id === milestone?.target?.id ? 32 : 24}
                        height={val.id === milestone?.target?.id ? 44 : 32}
                      />
                    </a>
                  </div>
                );
              }
            } else {
              return (
                <div
                  key={val.id}
                  className="flex justify-center items-end min-w-[126px]"
                >
                  <a
                    onClick={() => {
                      if (val.id === milestone?.target?.id) {
                        return;
                      } else {
                        handleChange(val.id);
                      }
                    }}
                  >
                    <Icon
                      name={iconName.flag}
                      color={val.is_completed === 2 ? "white" : "default"}
                      size={val.id === milestone?.target?.id ? 80 : 70}
                    />
                  </a>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  } else if (allMilestone.length === 0) {
    return (
      <div className="w-full h-auto mx-auto mt-14 overflow-y-auto pt-[36.8513%] relative bg-roadmap">
        <h2 className="text-default mx-auto w-fit mt-3 absolute left-0 right-0 top-0">
          目標なし...
        </h2>
      </div>
    );
  }
};

export default Roadmap;

Roadmap.propTypes = {
  allMilestone: PropTypes.array.isRequired,
  milestone: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};
