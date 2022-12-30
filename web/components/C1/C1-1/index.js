import Head from "next/head";
import React, { useEffect, useState } from "react";
import BackButton from "~/components/BackButton";
import AchievementPost from "~/components/C1/C1-Post/AchievementPost";
import ManualPost from "~/components/C1/C1-Post/ManualPost";
import ProgressAchievePost from "~/components/C1/C1-Post/ProgressAchievePost";
import PlanSetPost from "~/components/C1/C1-Post/PlanSetPost";
import { useRouter } from "next/router";
import Comment from "~/components/C1/C1-1/comment/Comment";
import CommentCreate from "~/components/C1/C1-1/comment/CommentCreate";
import Link from "next/link";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import { getAllCommentsByPostId } from "~/utils/comment";
import ky from "ky";
import { getPostById } from "~/utils/post";
import PostType from "~/Enums/PostType";

const NUMBER_OF_INITIAL_COMMENTS = 4;
const PostDetail = () => {
  const router = useRouter();
  const { post_id, naitei_id: userId } = router.query;
  const [currentUser, setCurrentUser] = useState({ avatar: "#" });
  const [userInfo, setUserInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [commentsMaxLength, setCommentsMaxLength] = useState(0);
  const [limitCommentsDisplayed, setLimitCommentsDisplayed] = useState(
    NUMBER_OF_INITIAL_COMMENTS
  );
  const [post, setPost] = useState();

  const getComments = async () => {
    const data = await getAllCommentsByPostId(post_id, limitCommentsDisplayed);
    setComments(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
      const commentsMax = await getAllCommentsByPostId(post_id);
      setCommentsMaxLength(commentsMax?.length);

      const postData = await getPostById(post_id);
      setPost(postData);

      const userRes = await ky
        .get(`/api/users/naiteisha?user_id=${userId}`)
        .json();
      setUserInfo(userRes.data);
    };
    fetchData();
  }, [post_id, userId]);

  useEffect(() => {
    const showComment = async () => {
      const data = await getAllCommentsByPostId(
        post_id,
        limitCommentsDisplayed
      );
      setComments(data);
    };
    showComment();
  }, [limitCommentsDisplayed, post_id]);

  const readmoreComment = async () => {
    setLimitCommentsDisplayed((prev) => prev + 4);
  };

  const showPost = (post) => {
    if (!post) return;
    if (post.type === PostType.USERPOST) {
      return (
        <ManualPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
          postUserName = {userInfo.japaneseFullname}
        />
      );
    } else if (post.type === PostType.TARGET_RESULT) {
      return (
        <AchievementPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
          postUserName = {userInfo.japaneseFullname}
          naiteiId={parseInt(userId)}
        />
      );
    } else if (post.type === PostType.NEW_TARGET) {
      return (
        <PlanSetPost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
          postUserName = {userInfo.japaneseFullname}
          naiteiId={parseInt(userId)}
        />
      );
    } else {
      return (
        <ProgressAchievePost
          {...post}
          user={userInfo}
          showBorder={false}
          showShadow={false}
          postUserName = {userInfo.japaneseFullname}
        />
      );
    }
  };
  return (
    <div>
      <Head>
        <title>PostDetail</title>
      </Head>
      <NaiteishaTopLayout userInfo={userInfo}>
        <div
          className="bg-[#E5E5E5] w-full overflow-y-scroll"
          style={{ height: "calc(100vh - 246px)" }}
        >
          <div className="flex flex-col bg-white mt-2 p-5 pt-3 rounded-lg">
            <BackButton onClick={() => router.back()} />
            <div className="px-8">
              <div className="mb-2">{showPost(post)}</div>
              <CommentCreate
                imageUrl={currentUser.avatar}
                getComments={getComments}
                setCommentsMaxLength={setCommentsMaxLength}
              />

              {comments?.length !== 0 ? (
                <div>
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      imageUrl={comment.avatar}
                      commentId={comment.id}
                      content={comment.content ? comment.content : null}
                      name={comment.japaneseFullname}
                      userId={comment.userId}
                      createdAt={comment.createdAt}
                      getComments={getComments}
                      setCommentsMaxLength={setCommentsMaxLength}
                      listImage={comment.images}
                    />
                  ))}
                  {commentsMaxLength > 4 &&
                    comments.length < commentsMaxLength && (
                      <div
                        style={{
                          borderBottom: "1px solid #a4cff1",
                        }}
                        className="text-center pt-3 pb-6"
                      >
                        <span
                          className="font-bold cursor-pointer hover:text-primary transition-all"
                          onClick={() => {
                            readmoreComment();
                          }}
                        >
                          コメントをもっと見る(
                          <span>{commentsMaxLength - comments.length}</span>)
                        </span>
                      </div>
                    )}
                </div>
              ) : (
                <div className="pt-3 pb-6 text-center text-xl font-bold">
                  まだコメントはありません
                </div>
              )}
            </div>
          </div>
        </div>
      </NaiteishaTopLayout>
    </div>
  );
};

export default PostDetail;
