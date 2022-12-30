import { Button, Carousel, Modal } from "antd";
import React, { useRef, useState } from "react";
import defaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "~/components/Icon";

const ImagesList = ({ listImage, avatar, author }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sliderRef = useRef(null);

  return (
    <>
      <Modal 
        centered
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        bodyStyle={{
          display: "relative",
          padding: "0",
          backgroundColor: "#364d79"
        }}
        width="65vw"
      >
        <Carousel 
          autoplay 
          effect="fade"
          ref={sliderRef}
        >
          {listImage?.map((eachImage, index) => {
            return (
              <div
                key={`comment-image-${index}`} 
                className="h-[75vh] flex justify-center items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={(eachImage?.imageUrl.startsWith("images/") ? `/` : "") + eachImage?.imageUrl}
                  className="object-contain max-h-[75vh]"
                  alt="some-images"
                />
              </div>
            )
          })}
        </Carousel>
        <div 
          className="bg-gradient-to-b from-gray-800/30 to-gray-200/0
          w-full absolute top-0 left-0 p-2
          flex items-start gap-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={
              avatar
                ? avatar.startsWith("images")
                  ? "/" + avatar
                  : avatar
                : defaultAvatar.src
            }
            className="rounded-full object-cover w-10 h-10"
            alt="avatar"
          />
          <div>
            <p className="m-0 font-bold text-base text-white">
              {author}
            </p>
          </div>
        </div>
        <Button 
          className="absolute top-1/2 left-2"
          shape="circle"
          onClick={() => sliderRef.current?.prev()}
        >
          <Icon className="rotate-180" name="arrow-right" color="default" size={24} />
        </Button>

        <Button 
          className="absolute top-1/2 right-2"
          shape="circle"
          onClick={() => sliderRef.current?.next()}
        >
          <Icon name="arrow-right" color="default" size={24} />
        </Button>
      </Modal>

      <div className="flex gap-1 mt-2">
        {listImage?.length > 3 ? 
          <>
            {listImage.slice(0, 3).map((eachImage, index) => {
              if(eachImage) {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={index}
                    src={(eachImage.imageUrl.startsWith("images/") ? `/` : "") + eachImage.imageUrl}
                    className="object-contain max-w-[15vw] max-h-[18vh] cursor-pointer"
                    alt=""
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                )
              }
            })}
            <div 
              className="w-[15vw] h-[18vh] relative cursor-pointer 
              flex justify-center items-center"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(listImage[3]?.imageUrl.startsWith("images/") ? `/` : "") + listImage[3]?.imageUrl}
                className="object-contain max-w-[15vw] max-h-[18vh]"
                alt=""
              />
              <div
                className="w-[15vw] h-[18vh] bg-black bg-opacity-70 
                flex justify-center items-center
                absolute left-0 top-0 cursor-pointer"
              >
                <h1 className="m-0 text-center text-4xl text-white font-bold">
                  {`+${listImage.length - 3}`}
                </h1>
              </div>
            </div>
          </> 
          :
          listImage?.map((eachImage, index) => {
            if(eachImage) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={(eachImage.imageUrl.startsWith("images/") ? `/` : "") + eachImage.imageUrl}
                  className="object-contain max-w-[15vw] max-h-[18vh] cursor-pointer"
                  alt=""
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                />
              )
            }
          })
        }
      </div>
    </>
  )
}

export default React.memo(ImagesList);
