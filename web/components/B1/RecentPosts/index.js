import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import AchievementPost from "~/components/C1/C1-Post/AchievementPost";
import ManualPost from "~/components/C1/C1-Post/ManualPost";
import PlanSetPost from "~/components/C1/C1-Post/PlanSetPost";
import ProgressAchievePost from "~/components/C1/C1-Post/ProgressAchievePost";
import NoData from "~/components/NoData";
import PostType from "~/Enums/PostType";
import { getAllPosts } from "~/utils/post";

export default function RecentPosts() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    data: pagesData,
  } = useInfiniteQuery(
    "/posts",
    ({ pageParam = 1 }) => getAllPosts(pageParam),
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
    const fetchData = async () => {
      refetch();
    };
    fetchData();
  }, [refetch]);

  return (
    <div
      ref={postListRef}
      className="recent-posts flex-1 overflow-y-scroll flex flex-col gap-2 py-2"
    >
      {!pagesData?.pages[0].length || (isFetching && !isFetchingNextPage) ? (
        <div className="mt-4">
          <NoData />
        </div>
      ) : (
        pagesData?.pages.map((eachPage) => {
          return eachPage.map((post, i) => {
            if (post.type === PostType.USERPOST) {
              return (
                <ManualPost
                  ref={eachPage.length === i + 1 ? lastPostRef : null}
                  {...post}
                  postUserName={post.japanese_fullname}
                  key={post.id}
                  naiteiId={post.userId}
                />
              );
            }
            if (post.type === PostType.TARGET_RESULT) {
              return (
                <AchievementPost
                  ref={eachPage.length === i + 1 ? lastPostRef : null}
                  {...post}
                  key={post.id}
                  postUserName={post.japanese_fullname}
                  isShowDetail={false}
                  naiteiId={post.userId}
                />
              );
            }
            if (post.type === PostType.NEW_TARGET) {
              return (
                <PlanSetPost
                  ref={eachPage.length === i + 1 ? lastPostRef : null}
                  {...post}
                  key={post.id}
                  postUserName={post.japanese_fullname}
                  isShowDetail={false}
                  naiteiId={post.userId}
                />
              );
            }
            if (post.type === PostType.PROGRESS) {
              return (
                <ProgressAchievePost
                  ref={eachPage.length === i + 1 ? lastPostRef : null}
                  {...post}
                  postUserName={post.japanese_fullname}
                  key={post.id}
                  naiteiId={post.userId}
                />
              );
            }
          });
        })
      )}
    </div>
  );
}
