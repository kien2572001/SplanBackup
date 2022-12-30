/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Carousel, Col, Image, Modal, Row, Tooltip, Spin } from "antd";
import { useEffect, useState } from "react";
import D1SideBar from "./D1SideBar";
import Navbar from "../../layout/Navbar";
import { showNotification } from "../../Notification";
import PageHeader from "../../PageHeader";
import { deleteDoc, getDocById } from "~/utils/document";
import { useRouter } from "next/router";
import UserRole from "~/Enums/UserRole";
const messages = {
  deleteAlert: "この教材を削除してもよろしいですか? 削除後に復元できません。",
  deleteSuccess: "教材が削除されました。",
};

export default function DocDetail() {
  const [doc, setDoc] = useState();
  const router = useRouter();
  const { docId } = router.query;
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUserInfo(currentUser);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const fetchDoc = async () => {
      const res = await getDocById(docId);

      if (res.success) {
        setDoc(res.data);
      } else {
        showNotification({
          type: "error",
          title: res.message,
        });
      }
    };

    fetchDoc();
  }, [docId]);

  const handleBack = () => {
    router.push("/documents");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-default font-bold text-base">
          削除後に復元できません。
        </div>
      ),
      icon: <ExclamationCircleOutlined />,
      content: <div className="">この教材を削除してもよろしいですか? </div>,
      okText: "削除",
      cancelText: "キャンセル",
      onOk() {
        const delDoc = async () => {
          const res = await deleteDoc(docId);

          if (res.success) {
            showNotification({
              type: "success",
              title: messages.deleteSuccess,
            });

            setTimeout(() => {
              router.push("/documents");
            }, 5000);
          } else {
            showNotification({
              type: "error",
              title: res.message,
            });
          }
        };

        delDoc();
      },
      onCancel() {},
    });
  };

  const handleEdit = () => {
    router.push(`/documents/${docId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spin size="middle" />
      </div>
    );
  }
  return (
    <div className="text-default">
      <div>
        <div className="navbar-container w-full fixed left-0 z-10">
          <Navbar />
        </div>
        <div className="flex w-full">
          <div className="b-sidebar-container fixed left-0 top-0 mt-16 z-20">
            <D1SideBar />
          </div>
          <div className="ml-[224px] mt-16 w-full ">
            <div
              className="bg-[#E5E5E5] w-full flex px-2 gap-2 overflow-y-hidden"
              style={{ height: "calc(100vh - 64px)" }}
            >
              <div className="bg-white w-full py-2">
                <div className="p-8 w-full">
                  <PageHeader
                    type="detail"
                    onEditBtnClick={handleEdit}
                    onBackBtnClick={handleBack}
                    //onDeleteBtnClick={handleDelete}
                    showEditBtn={userInfo.role === UserRole.MENTOR}
                    showDeleteBtn={userInfo.role === UserRole.MENTOR}
                    title={
                      <div className="flex flex-col">
                        <span>{doc?.doc_name}</span>
                        <span className="text-base">
                          カテゴリ：
                          {doc?.category.name}
                        </span>
                      </div>
                    }
                  />
                  <div className="w-full flex justify-center">
                    <Row
                      gutter={[24]}
                      style={{ margin: 0 }}
                      className="pt-10 w-2/3"
                    >
                      <Col span={12} className="flex justify-center flex-col">
                        <div className="py-2">
                          <div className="py-2 text-[20px] font-semibold">
                            内容：
                          </div>
                          <div className="text-justify">{doc?.doc_content}</div>
                        </div>
                        <div className="flex py-2 items-center gap-x-2">
                          <div className="text-[20px] font-semibold">
                            最大実施内容：
                          </div>
                          <div>
                            <span>{doc?.limit}</span>
                            <span> {doc?.unit.name}</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12} className="w-1/2 flex justify-end">
                        <Carousel
                          className="w-[380px] h-[324px] text-center"
                          autoplay
                        >
                          {doc?.images.map((image, index) => {
                            return (
                              <div
                                key={index}
                                className="bg-[rgba(61,169,252,0.5)] h-[324px] pt-5"
                              >
                                <Image
                                  className="object-contain"
                                  width={380}
                                  height={250}
                                  src={
                                    (image.img_link.startsWith("images/")
                                      ? `/`
                                      : "") + image.img_link
                                  }
                                  preview={false}
                                />
                              </div>
                            );
                          })}
                        </Carousel>
                      </Col>
                      <div className="w-full flex justify-end py-8">
                        <div>
                          <a
                            className="underline underline-offset-2"
                            href={doc?.url}
                            target="blank"
                          >
                            見てみる
                          </a>
                          <Tooltip
                            title={doc?.url}
                            placement="top"
                            className="p-2 m-2 shadow-md"
                          >
                            URL
                          </Tooltip>
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
