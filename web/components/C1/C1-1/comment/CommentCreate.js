import Image from "next/image";
import React from "react";
import defaultAvatar from "~/assets/images/default-avatar.png";
import CommentInput from "./CommentInput";

const CommentCreate = ({ imageUrl, getComments, setCommentsMaxLength }) => {
  return (
    <div
      className="flex gap-5 p-5"
      style={{
        borderTop: "1px solid #a4cff1",
        borderBottom: "1px solid #a4cff1",
      }}
    >
      <div className="h-12 w-12">
        <picture>
          <source
            srcSet={
              imageUrl
                ? imageUrl.startsWith("images")
                  ? "/" + imageUrl
                  : imageUrl
                : defaultAvatar.src
            }
            type="image/webp"
          />
          <img
            src={
              imageUrl
                ? imageUrl.startsWith("images")
                  ? "/" + imageUrl
                  : imageUrl
                : defaultAvatar.src
            }
            className="rounded-full object-cover w-12 h-12"
            alt="avatar"
          />
        </picture>
      </div>
      <div className="min-w-[75%]">
        <CommentInput
          isEditForm={false}
          getComments={getComments}
          setCommentsMaxLength={setCommentsMaxLength}
        />
      </div>
    </div>
  );
};
export default React.memo(CommentCreate);
