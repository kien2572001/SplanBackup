import moment from "moment";
import Link from "next/link";
import React from "react";
import Icon from "~/components/Icon";

const C1CurrentSkill = ({ title, targets, naitei_id }) => {
  let linkToDetail;
  if(title == "現状"){
    linkToDetail=`/naitei/${naitei_id}/basics/targets`;
  }
  if(title == "発達"){
    linkToDetail=`/naitei/${naitei_id}/basics/achievements`
  }
  return (
    <div className="w-[400px] px-8 shadow-md rounded-2xl flex flex-col items-center py-8 bg-white mb-2">
      <div className="flex justify-between self-start mb-2 text-primary w-full ">
        {title === "現状" ? (
          <div className="flex items-center gap-2">
            <Icon name="flag-2-line" color="primary" size={24} />
            <h3 className="mb-0 text-primary leading-none">現在の目標</h3>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Icon name="pin" color="primary" size={24} />
            <h3 className="mb-0 text-primary leading-none">発達済みの目標</h3>
          </div>
        )}
        <Link href={linkToDetail} className="flex items-center">
          <div className="cursor-pointer flex items-center gap-1">
            <Icon name="open-preview" color="primary" size={20} />
            <span>詳細</span>
          </div>
        </Link>
      </div>
      {targets && targets.length > 0 &&
        <div className="w-full text-base font-normal text-[#C6C6C6] mb-8"> 
          {moment(targets[0].dateOfTarget).format("YYYY/MM")}
        </div> 
      }

      {targets && targets.length>0 && targets.map(target => (
        target.type===0 && (
          <div className="flex items-start justify-between self-start w-full mb-5"
            key={target.id}
          >
            <div>
              <h3 className="font-bold mb-0">{target.contestName}</h3>
              <span className="font-medium text-base text-[#BFBFBF]">
                {moment(target.dateOfTarget).format("YYYY/MM/DD")}
              </span>
            </div>
            <div className="flex items-center">
              <h3 className="font-bold">
                {title=="現状"? target.expectedScore : target.actualScore}
              </h3>
              <h3 className="font-bold">/</h3>
              <h3 className="font-bold">{target.maxScore}</h3>
            </div>
          </div>
        )
      ))}

      {targets && targets.map(target => (
        target.type===1 && (
          <div className="flex items-center justify-start w-full py-1" key={target.id} >
            {title=="現状"?
              <div className="text-2xl font-medium leading-6 pl-2 pr-3">•</div> :
              <div className="pl-2 pr-3">
                <Icon name="circle-check" color="primary" size={24}></Icon>
              </div>
            }
            <div className="text-xl leading-7 font-medium">{target.content}</div>
          </div>
        )
      ))}

      {(!targets || (targets && targets.length) === 0) && 
        <div className="flex w-full justify-center">データがありません。</div>
      }
    </div>
  );
};

export default C1CurrentSkill;
