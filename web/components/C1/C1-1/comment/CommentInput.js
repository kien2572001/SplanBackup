import { Input, message, Popover, Upload } from "antd";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createComment, updateComment } from "~/utils/comment";
import Button from "../../../Button";
import Icon from "../../../Icon";
import IconData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { showNotification } from "~/components/Notification";

const maxSize = 5000000;

const { TextArea } = Input;

const CommentInput = ({
  content,
  images,
  commentId,
  isEditForm,
  setIsEditingStatus,
  getComments,
  handleDisplayContent,
  setCommentsMaxLength,
}) => {
  const router = useRouter();
  const { post_id: id } = router.query;
  const [inputContent, setInputContent] = useState(null);
  const cursorStartPosition = useRef(0);
  const cursorEndPosition = useRef(0);
  const inputRef = useRef(null);
  const [insertEmojiSize, setInsertEmojiSize] = useState(0);
  const [emojiIconColor, setEmojiIconColor] = useState("disabled");
  const [image, setImage] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const handleCreateComment = async () => {
    if(inputContent) {
      const userId = JSON.parse(localStorage.getItem("currentUser")).id;
      const submitData = new FormData();
      submitData.append("userId", userId);
      submitData.append("content", inputContent);
      image.map(eachImage => submitData.append(eachImage.file.uid, eachImage.file));
      await createComment(id, submitData);
      getComments();
      setCommentsMaxLength((prev) => prev + 1);
      setInputContent("");
      setImage([]);
      setTotalSize(0);
    }
    inputRef.current.focus();
  };

  const handleEditComment = async (commentId) => {
    const submitData = new FormData();
    submitData.append("content", inputContent);
    image.map(eachImage => {
      if(eachImage?.file) {
        submitData.append(eachImage.file.uid, eachImage.file)
      }
    });
    const oldImage = image.filter(each => each && !each.file)
    submitData.append("oldImage", JSON.stringify(oldImage));
    await updateComment(submitData, commentId);
    getComments();
    handleDisplayContent();
    setIsEditingStatus(false);
  };

  const handleChangeImage = ({ file }) => {
    if(totalSize <= maxSize) {
      if(!image.find(each => 
        each?.file?.uid === file.originFileObj.uid
      )) {
        setTotalSize(prev => prev += file.size);
        setImage((prevImage) => [
          ...prevImage, 
          { 
            file: file.originFileObj,
            blob: URL.createObjectURL(file.originFileObj)
          }
        ]);
      }
    }
  };

  const handleDeleteImage = (eachImage) => {
    if(eachImage.file) {
      const newList = image.filter(each => each.file?.uid !== eachImage.file.uid);
      setTotalSize(prev => prev -= eachImage.file.size);
      setImage([...newList]);
    } else {
      const newList = image.filter(each => each !== eachImage);
      setTotalSize(prev => prev -= eachImage.size);
      setImage([
        ...newList,
        {
          ...eachImage,
          delete: true
        }
      ]);
    }
  }

  const handleBeforeUpload = (file, fileList) => {
    let newTotalSize = 0
    fileList.map(eachFile => newTotalSize += eachFile.size);

    const isPNG = file.type === 'image/png';
    const isJPEG = file.type === 'image/jpeg';
    const isJPG = file.type === 'image/jpg';
    const isFileSizeError = file.size > maxSize || newTotalSize > maxSize || file.size + totalSize > maxSize
    if(!(isPNG || isJPEG || isJPG) && isFileSizeError) {
      showNotification({
        key: '-1',
        type: "error",
        title: ".jpg、.png、.jpeg、サイズ5MB未満の画像を選択してください"
      })
      return Upload.LIST_IGNORE;
    }
    if (!(isPNG || isJPEG || isJPG)) {
      showNotification({
        key: '-1',
        type: "error",
        title: ".jpg、.png、.jpegの画像を選択してください" 
      })
      return Upload.LIST_IGNORE;
    }
    if(isFileSizeError) {
      showNotification({
        key: '-1',
        type: "error",
        title: "5MB未満の画像を選択してください" 
      })
      return Upload.LIST_IGNORE;
    }  
  }

  useEffect(() => {
    inputRef.current.focus();
    if(isEditForm) {
      if(images.length !== 0 ) {
        let totalSize = 0;
        images.map(each => {
          totalSize += each.size;
        })
        setImage([...images]);
        setTotalSize(totalSize);
      }
      if(!(content === "undefined" || content === "null")) {
        setInputContent(content);
      }
    }
  }, [isEditForm, images, content]);

  return (
    <div className={`relative max-w-full ${isEditForm ? "" : "flex gap-5"}`}>
      <div className="max-w-full flex flex-col p-2 w-full border-solid border border-primary rounded-lg">
        <TextArea
          id="comment_box"
          className="py-2 px-1 whitespace-pre-wrap"
          maxLength={500}
          autoSize={{ minRows: 1, maxRows: 8 }}
          placeholder="ここにコメントを書く"
          bordered={false}
          value={inputContent}
          ref={inputRef}
          onFocus={(e) => {
            if (insertEmojiSize !== 0) {
              cursorStartPosition.current = cursorEndPosition.current =
                cursorStartPosition.current + insertEmojiSize;
              e.target.selectionStart = cursorStartPosition.current;
              e.target.selectionEnd = cursorStartPosition.current;
              setInsertEmojiSize(0);
            }
          }}
          onBlur={() => {
            setEmojiIconColor("disabled");
          }}
          onKeyUp={(e) => {
            cursorStartPosition.current = e.target.selectionStart;
            cursorEndPosition.current = e.target.selectionEnd;
          }}
          onClick={(e) => {
            cursorStartPosition.current = e.target.selectionStart;
            cursorEndPosition.current = e.target.selectionEnd;
          }}
          onChange={(e) => {
            setInputContent(e.target.value);
          }}
        />
        <div className="flex gap-1 max-w-[800px] flex-wrap">
          {image.length !== 0 && image.map((eachImage, index) => {
            if(!eachImage.delete) {
              return (
                <div 
                  key={`input-image-${index}`} 
                  className="w-[15vw] h-[18vh] transition-all relative
                  flex justify-center items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      !eachImage?.file 
                      ? (eachImage.imageUrl.startsWith("images/") ? `/` : "") + eachImage.imageUrl 
                        : eachImage.blob
                    }
                    className="object-contain max-w-[15vw] max-h-[18vh]"
                    alt="input-image"
                  />
                  <div
                    className="w-full h-full bg-black bg-opacity-70 
                    flex opacity-0 hover:opacity-100 transition-all justify-center items-center 
                    absolute left-0 top-0 cursor-pointer"
                    onClick={() => handleDeleteImage(eachImage)}
                  >
                    <Icon name="delete" color="danger" size={18} />
                  </div>
                </div>
              )
            }
          })}
        </div>
        <div className="ml-auto flex space-x-3 group-icon">
          <Popover
            onClick={() => {
              inputRef.current.focus();
              setEmojiIconColor("active");
            }}
            content={
              <Picker
                data={IconData}
                skinTonePosition="none"
                previewEmoji=""
                onEmojiSelect={(e) => {
                  const hexCodeArr = e.unified
                    .split("-")
                    .map((element) => parseInt(element, 16));
                  const emoji = String.fromCodePoint(...hexCodeArr);
                  setInsertEmojiSize(emoji.length);
                  setInputContent(
                    (inputContent ?? "").substring(
                      0,
                      cursorStartPosition.current
                    ) +
                      emoji +
                      (inputContent ?? "").substring(cursorEndPosition.current)
                  );
                }}
              />
            }
            title="Icon"
            trigger="click"
          >
            <Icon className="cursor-pointer" name="smile-face" color={emojiIconColor} />
          </Popover>
          <Upload
            accept="image/*"
            onChange={handleChangeImage}
            showUploadList={false}
            multiple={true}
            beforeUpload={handleBeforeUpload}
          >
            <Icon className="cursor-pointer" name="image" color="disable" />
          </Upload>
        </div>
      </div>
      {!isEditForm && (
        <div
          className="absolute cursor-pointer right-0 top-[50%] translate-x-[150%] translate-y-[-50%]"
          onClick={() => {
            handleCreateComment();
          }}
        >
          <Icon name="send" size={48}></Icon>
        </div>
      )}
      {isEditForm && (
        <div className="mt-3 flex justify-end gap-3">
          <Button
            type="border"
            onClick={() => {
              setIsEditingStatus(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            type="fill"
            onClick={() => {
              handleEditComment(commentId);
            }}
          >
            更新
          </Button>
        </div>
      )}
    </div>
  );
};
export default React.memo(CommentInput);
