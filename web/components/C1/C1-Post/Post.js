import React, { useEffect } from "react";
import moment from "moment";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";
import ky from "~/api/client";
import defaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "../../Icon";
import "moment/locale/ja";

moment.locale("ja");

/* eslint-disable-next-line react/display-name */
const C1Post = React.forwardRef((props, ref) => {
  const [liked, setLiked] = useState(
    props.likes.find(
      (item) =>
        item.user_id === JSON.parse(localStorage.getItem("currentUser")).id
    )
  );

  let [likesCount, setLikesCount] = useState(props.likesCount);

  const handleClickLike = async () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      await ky
        .post(`toggle-like?user_id=${currentUser.id}&post_id=${props.id}`)
        .json();
    } catch (err) {
      console.log("error on click like button");
      setLiked(liked);
      setLikesCount(likesCount);
    }
  };
  const month = parseInt(props.content.slice(5));
  const year = parseInt(props.content.slice(0, 4));

  return (
    <div
      ref={ref}
      className={`flex flex-col w-full bg-white items-stretch pl-4 px-8 py-4 rounded-xl text-default ${
        !props.showShadow ? "" : "shadow-md"
      }`}
      style={{
        border: `${!props.showBorder ? "none" : "1px solid #ddd"}`,
      }}
    >
      <div className="post-top flex items-center justify-between w-full mb-2">
        <Link href={`/naitei/${props.userId}`}>
          <a className="post-top-left flex items-center gap-3">
            <div className="avatar w-12 h-12 rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-full object-fill w-[48px] h-[48px]"
                alt="avatar"
                src={
                  props.avatar
                    ? (props.avatar.startsWith("images/") ? "/" : "") +
                      props.avatar
                    : defaultAvatar.src
                }
              />
            </div>
            <h4 className="naiteisha-name font-bold max-w-[300px]">
              {props.postUserName}
            </h4>
          </a>
        </Link>

        <div className="post-top-right">
          {moment(props.createdAt).isSame(moment(), "day") ? (
            <span>{moment(props.createdAt).fromNow()}</span>
          ) : (
            <span>{moment(props.createdAt).format("YYYY/MM/DD HH:mm")}</span>
          )}
        </div>
      </div>

      <div className="post-body pl-12 w-full">
        <div className="memo-container w-full text-start mb-3">
          {props.memo && <Memo text={props.memo} />}
        </div>
        {window.location.href.includes("post-detail") &&
        !props.content.includes("時間") ? ( // Check type of post we need to Link
          <Link
            href={{
              pathname: `/naiteishaplan/${props.userId}`,
              query: { month: month, year: year },
            }}
          >
            <div
              className="post-content-container rounded-lg px-4 py-4 w-full"
              style={{ border: "1px solid #ddd", cursor: "pointer" }}
            >
              {props.children}
            </div>
          </Link>
        ) : (
          <Link
            href={{
              pathname: `/naitei/${props.userId}/posts/${props.id}`,
            }}
          >
            <div
              className="post-content-container rounded-lg px-4 py-4 w-full"
              style={{ border: "1px solid #ddd", cursor: "pointer" }}
            >
              {props.children}
            </div>
          </Link>
        )}
      </div>

      <div className="post-bottom pl-[80px] flex justify-center gap-[40px] mt-3">
        <LikeBtn
          likesCount={likesCount}
          onClick={handleClickLike}
          liked={liked}
        />
        <Link
          href={{
            pathname: `/naitei/${props.userId}/posts/${props.id}`,
          }}
        >
          <a className="text-default hover:text-default">
            <CommentBtn commentsCount={props.commentsCount} />
          </a>
        </Link>
      </div>
    </div>
  );
});

let LikeBtn = ({ liked, likesCount, onClick }) => {
  return (
    <div
      className="line-btn flex items-center gap-2 cursor-pointer w-[120px]"
      onClick={onClick}
    >
      <Icon name="like" color={liked ? "primary" : ""} size={24} />
      <div
        className={"like-count " + (liked ? "text-primary" : "text-default")}
      >
        {" "}
        {likesCount ? likesCount : "いいね"}{" "}
      </div>
    </div>
  );
};

let CommentBtn = ({ commentsCount }) => {
  return (
    <div className="line-btn flex items-center gap-2 cursor-pointer w-[120px]">
      <Icon name="comment" size={24} />
      <div>{commentsCount ? commentsCount : "コメント"}</div>
    </div>
  );
};

let Memo = ({ text }) => {
  return (
    <div className="memo">
      <h4>{text}</h4>
    </div>
  );
};

C1Post.propTypes = {
  id: PropTypes.number.isRequired,
  showShadow: PropTypes.bool,
  showBorder: PropTypes.bool,
  japanese_fullname: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  memo: PropTypes.string,
  children: PropTypes.node.isRequired,
  createdAt: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.number,
      username: PropTypes.string,
    })
  ),
  userId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
};

C1Post.defaultProps = {
  showShadow: true,
  showBorder: true,
};

export default C1Post;
