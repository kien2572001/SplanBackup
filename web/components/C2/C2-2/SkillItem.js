import Icon from "~/components/Icon";
const SkillItem = ({contest_name, contest_score_eachs, score_eachs, date_of_contest, free_content}) => {
  const caculateTarget = (score_eachs) => {
    return score_eachs.reduce((sum, score_each) => sum + score_each.result, 0);
  }
  const caculateContest = (contest_score_eachs) => {
    return contest_score_eachs.reduce((sum, contest_score_each) => 
    sum + contest_score_each.max_score, 0);
  }
  if(free_content){
    return(
      <div className="flex flex-col gap-y-3 pl-12 mb-9"
      style={{marginBottom: "36px"}}>
        <div className="flex items-center gap-x-5">
          <Icon name="circle-check" size={36} color="primary"/>
          <div className="w-full flex justify-between items-center">
            <div className="text-2xl font-bold">{free_content.content}</div>
          </div>
        </div>
      </div>
    )
  } else {
    return(
      <div className="flex flex-col gap-y-2 pl-12 mb-9"
      style={{marginBottom: "36px"}}>
        <div className="flex gap-x-5 items-center">
          <Icon name="circle-check" size={36} color="primary" />
          <div className="w-full flex justify-between ">
            <div className="text-[30px] font-bold">{contest_name}</div>
            <div className="text-[30px] font-bold text-primary leading-8">
              {caculateTarget(score_eachs)}/{caculateContest(contest_score_eachs)}
            </div>
          </div>
        </div>
        <div className="pl-[56px] text-[18px] text-[#BFBFBF] font-medium">
          {date_of_contest?.split('-').slice(0,2).join('/')}
        </div>
        {
          score_eachs.map((score_each, index) => (
            <div className="flex items-end justify-between" 
            style={{paddingLeft: '66px'}} key={index}>
              <div className="text-2xl">{score_each.part_name}</div>
              <div className="text-2xl font-bold">
                {score_each.result}/{contest_score_eachs[index].max_score}
              </div>
            </div>        
          ))
        }
      </div>
    )
  }
}

export default SkillItem;

