import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Icon from "~/components/Icon";

function FreeContentCard({ targetDetails, achievement = false }) {
  if (targetDetails) {
    return (
      <div className="flex w-full flex-col">
        <div>
          {/* <h3 className='mb-1'>{ targetDetails[0]?.category?.name }</h3> */}
          {targetDetails.map((element) => {
            if (element?.type !== 0) {
              return (
                <div
                  key={element?.id}
                  className=" ml-7 text-xl font-semibold flex justify-between justify-items-center"
                >
                  {/* <span>・{achievement ? element?.free_content?.result : element?.free_content?.content }</span> */}
                  <span>・{element?.free_content?.content}</span>
                  {achievement && element?.free_content?.result === "done" && (
                    <span className="text-default">
                      <Icon name="circle-check" size={25} color="primary" />
                    </span>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default FreeContentCard;

FreeContentCard.propTypes = {
  targetDetails: PropTypes.array.isRequired,
  achievement: PropTypes.bool,
};
