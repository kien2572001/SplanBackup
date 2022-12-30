import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Space } from "antd";
import ky from "~/api/ky";
import Icon from "~/components/Icon";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import C21SideBar from "~/components/layout/C21Sidebar";
import SkillItem from "./SkillItem";

const Targets = () => {
  const router = useRouter();
  let { naitei_id } = router.query;
  const [userInfo, setUserInfo] = useState({});
  const [iscurrentUser, setIsCurrentUser] = useState(false);
  const [targetDetails, setTargetDetails] = useState({});
  const [targetDate, setTargetDate] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [milestone, setMileStone] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if(currentUser.id == parseInt(naitei_id)) setIsCurrentUser(true);
      const userRes = await ky
        .get(`/api/users/naiteisha?user_id=${naitei_id}`)
        .json();
      setUserInfo(userRes.data);
      try{
        const targetRes = await ky
          .get(`/api/targets/achivement-status/${naitei_id}`)
          .json();
        if(targetRes.data.id){
          const targetId = targetRes.data.id;
          const targetDetailRes = await ky 
            .get(`/api/targets/${targetId}`)
            .json();
          setTargetDetails(targetDetailRes.data.target.target_details);
          setTargetDate(targetDetailRes.data.target.date_of_target);
          setMileStone(targetDetailRes.data.target.id);
        } else {
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  },[naitei_id]);

  return(
    <NaiteishaTopLayout userInfo={userInfo} active={'基本データ'}>
      <div className="wrappe w-full overflow-y-auto">
        <div className="bg-white my-3 rounded-[20px] pl-8 pt-8 pb-8">
          <h1 className="text-center font-medium"> 達成済みの目標 </h1>
          <div className="grid grid-cols-12 px-8 pb-8 mt-12">
            <div className="col-span-2" style={{ borderRight: "1px solid #D9D9D9" }}>
              <div className="pt-10 pb-10 font-medium text-[30px]">
                基本データ
              </div>
              <Space direction="vertical" size="large">
                <C21SideBar naiteiId={naitei_id} />
              </Space>
            </div>
            {!isLoading && 
              <div className="col-start-4 col-span-9">
                <div className="flex justify-between items-center">
                  <h3> マイルストーン : { targetDate?.split('-').slice(0,2).join('/') }
                  </h3>
                  {
                    iscurrentUser && 
                    <Link href={`/naitei/${naitei_id}/milestones/${milestone}/achievements/edit`}>  
                      <Icon
                        className="cursor-pointer"
                        name="pencil-squared"
                        color="primary"
                        size={30}
                      />
                    </Link>
                  }
                </div>
                <h3 className="font-bold text-[36px] mt-3">試験</h3>
                <div className="px-3">
                  <h3 className="font-bold text-[30px] mt-3 pl-3">言語</h3>
                  {targetDetails &&
                    targetDetails.length > 0 &&
                    targetDetails.map(targetDetail => {
                      if(targetDetail.category_id == 5 && targetDetail.type === 0 ){
                        return(
                          <SkillItem
                            contest_name={targetDetail.test_content?.contest.contest_name}
                            contest_score_eachs={targetDetail.test_content?.contest.contest_score_eachs}
                            score_eachs={targetDetail.test_content?.score_eachs}
                            date_of_contest={targetDetail.test_content?.date_of_contest}
                            free_content={targetDetail.free_content}
                          />
                        )
                      }
                    })
                  }
                  <h3 className="font-bold text-[30px] mt-3 pl-3">IT知識・技術</h3>
                  {targetDetails && 
                    targetDetails.length > 0 &&
                    targetDetails.map(targetDetail => {
                      if(targetDetail.category_id == 3 && targetDetail.type === 0 ) {
                        return(
                          <SkillItem
                            contest_name={targetDetail.test_content?.contest.contest_name}
                            contest_score_eachs={targetDetail.test_content?.contest.contest_score_eachs}
                            score_eachs={targetDetail.test_content?.score_eachs}
                            free_content={targetDetail.free_content}
                            date_of_contest={targetDetail.test_content?.date_of_contest}
                          />
                        )
                      }
                    })
                  }
                </div>
                <h3 className="font-bold text-[30px] mt-6">その他</h3>
                 <div className="px-3">
                  {targetDetails && 
                    targetDetails.length > 0 &&
                    targetDetails.map(targetDetail => {
                      if(targetDetail.type === 1 ) {
                        return(
                          <SkillItem
                            contest_name={targetDetail.test_content?.contest.contest_name}
                            contest_score_eachs={targetDetail.test_content?.contest.contest_score_eachs}
                            score_eachs={targetDetail.test_content?.score_eachs}
                            date_of_contest={targetDetail.test_content?.date_of_contest}
                            free_content={targetDetail.free_content}
                          />
                        )
                      }
                    })
                  }
                 </div>
              </div>
            }
          </div>
        </div>
      </div>
    </NaiteishaTopLayout>
  )  

}

export default Targets;