import { Spin } from "antd";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import ky from "~/api/ky";
import AchievementPost from "~/components/C1/C1-Post/AchievementPost";
import ManualPost from "~/components/C1/C1-Post/ManualPost";
import NoData from "../NoData";
import PlanSetPost from "~/components/C1/C1-Post/PlanSetPost";
import ProgressAchievePost from "~/components/C1/C1-Post/ProgressAchievePost";
import C1CreatePost from "~/components/C1/C1CreatePost";
import C1CurrentSkill from "~/components/C1/C1CurrentSkill";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import PostType from "~/Enums/PostType";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "~/utils/post";
import C1PostSkeleton from "./C1-Post/PostSkeleton";
import C1CurrentSkillSkeleton from "./C1CurrentSkillSkeleton";

const NaiteishaOverview = ({ userData }) => {
  // get route param naitei_id
  const router = useRouter();
  let { naitei_id } = router.query;
  naitei_id = parseInt(naitei_id);
  const [currentUser, setCurrentUser] = useState({
    avatar: "",
    id: null,
  });
  const [posts, setPosts] = useState([]);
  const [loadingTarget, setLoadingTarget] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [currentTargets, setCurrentTargets] = useState([]);
  const [achievement, setAchievement] = useState([]);
  const addPost = (post) => {
    setPosts([post].concat(posts));
  };
  const currentUserName = userData.japaneseFullname;
  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    data: pagesData,
  } = useInfiniteQuery(
    "users/posts",
    ({ pageParam = 1 }) => getPostsPage(naitei_id, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    }
  );

  const intObserver = useRef();
  const postListRef = useRef();

  // Callback get more post
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    console.log("fetching....")
    const fetchData = async () => {
      refetch();
      setUserInfo(userData);
      try {
        setLoadingTarget(true);
        const targetRes = await ky
          .get(`/api/users/target?user_id=${naitei_id}`)
          .json();
        setCurrentTargets([...targetRes.data.completed, ...targetRes.data.inCompleted]);
        const achiRes = await ky
          .get(`/api/users/target/lastest?user_id=${naitei_id}`)
          .json();
        if(achiRes.success){
          setAchievement(achiRes.data.target);
        }
      } catch (err){
        console.log(err)
      } finally {
        setLoadingTarget(false);
      }
    }  
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    fetchData();

    if (postListRef.current) {
      postListRef.current.scrollIntoView();
    }
  }, [naitei_id, router, userData, refetch]);


  
  return (
    <div>
      <NaiteishaTopLayout userInfo={userInfo}>
        <div className="overflow-y-auto">
          <div className="spacing py-1"></div>
          {loadingTarget && <>
            <C1CurrentSkillSkeleton />
            <C1CurrentSkillSkeleton />
          </>}
          {!loadingTarget && <>
            <C1CurrentSkill title="現状" targets={currentTargets} naitei_id={naitei_id}/>
            <C1CurrentSkill title="発達" targets={achievement} naitei_id={naitei_id} />
          </>}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="spacing py-1"></div>
          {userInfo?.id === currentUser.id && (
            <C1CreatePost currentUser={currentUser} addPost={addPost} />
          )}
          <div
            ref={postListRef}
            className="flex flex-col justify-center items-center pb-2 w-full gap-2"
          >
            {(isFetching && !isFetchingNextPage) && (
              <>
                <C1PostSkeleton />
                <C1PostSkeleton />
              </>)}
            
            {((pagesData?.pages[0].length !== 0 && !isFetching && !isFetchingNextPage) || (pagesData?.pages[0].length !== 0 && isFetching && isFetchingNextPage)) && (
              pagesData?.pages.map((eachPage) => {
                return eachPage.map((post, i) => {
                  if (post.type === PostType.USERPOST) {
                    return (
                      <ManualPost
                        ref={eachPage.length === i + 1 ? lastPostRef : null}
                        {...post}
                        key={post.id}
                        postUserName={currentUserName}
                      />
                    );
                  }
                  if (post.type === PostType.TARGET_RESULT) {
                    return (
                      <AchievementPost
                        ref={eachPage.length === i + 1 ? lastPostRef : null}
                        {...post}
                        key={post.id}
                        isShowDetail={false}
                        postUserName={currentUserName}
                        naiteiId={naitei_id}
                      />
                    );
                  }
                  if (post.type === PostType.NEW_TARGET) {
                    return (
                      <PlanSetPost
                        ref={eachPage.length === i + 1 ? lastPostRef : null}
                        {...post}
                        key={post.id}
                        isShowDetail={false}
                        postUserName={currentUserName}
                        naiteiId={naitei_id}
                      />
                    );
                  }
                  if (post.type === PostType.PROGRESS) {
                    return (
                      <ProgressAchievePost
                        ref={eachPage.length === i + 1 ? lastPostRef : null}
                        {...post}
                        key={post.id}
                        postUserName={currentUserName}
                      />
                    );
                  }
                });
              })
            )
            }
            
            {(pagesData?.pages[0].length !== 0 && isFetching && isFetchingNextPage) &&
              <>
                <C1PostSkeleton />
                <C1PostSkeleton />
              </>
            }

            {(pagesData?.pages[0].length === 0 && !isFetching && !isFetchingNextPage) &&
            (
              <div className = "mt-4">
                <NoData />
              </div>
            )}
          </div>
        </div>
      </NaiteishaTopLayout>
    </div>
  );
};

export default NaiteishaOverview;
