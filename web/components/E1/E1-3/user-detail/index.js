import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Spin, Checkbox } from "antd";
import DisabledContext from "antd/lib/config-provider/DisabledContext";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "~/api/client";
import defaultAvt from "~/assets/images/default-avatar.png";
import EachInput from "./EachInput";
import SettingLayout from "~/components/layout/SettingLayout";
import { showNotification } from "~/components/Notification";
import PageHeader from "~/components/PageHeader";
import UserRole from "~/Enums/UserRole";
import ModalContent from "./ModalContent";

const UserDetail = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [disableOKButton,setDisableOKButton] = useState(true);
  let state = true;
  const handleDelete = () => {
    if (
      (currentUser.role == UserRole.MENTOR &&
        userData.role != UserRole.MENTOR) ||
      (currentUser.role == UserRole.SUPER_ADMIN &&
        userData.role == UserRole.MENTOR)
    ) {
      state = disableOKButton;
      const modal = Modal.confirm({
        title: "このユーザを削除してもよろしいですか?",
        centered: true,
        icon: <ExclamationCircleOutlined />,
        content: <ModalContent disable = {disableOKButton} setDisable = {setDisableOKButton} change = {(disable) => {
         state = disable;
          modal.update({ okButtonProps: { disabled: state}});
        }} />,
        okText: "削除",
        cancelText: "キャンセル",
        okButtonProps: { disabled: disableOKButton},

        async onOk() {
          try {
            await client.delete(`users/${userId}`).json();
            showNotification({
              type: "warning",
              title: "ユーザが削除されました。",
            });
            router.back();
          } catch (error) {
            console.log("Delete failed: ", error);
          }
        },
      });
     
    } else {
      showNotification({
        type: "error",
        title: "アクセス拒否。",
      });
    }
  };
  
  const handleEdit = () => {
    var userType = "";
    if (
      (currentUser.role == UserRole.MENTOR &&
        userData.role != UserRole.MENTOR) ||
      (currentUser.role == UserRole.SUPER_ADMIN &&
        userData.role == UserRole.MENTOR)
    ) {
      switch (userData.role) {
        case 1:
          userType = "naiteisha";
          break;
        case 3:
          userType = "teachers";
          break;
        case 4:
          userType = "clients";
          break;
        default:
          break;
      }
      router.push(`/settings/users/${userType}/${userId}/edit`);
    } else {
      showNotification({
        type: "error",
        title: "アクセス拒否。",
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await client.get(`users/${userId}`).json();
        if (res.success) {
          setUserData(res.data);
          setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
        } else {
          router.push(`/404`);
        }
      } catch (error) {
        console.log("Fetching error: ", error);
      }
      setLoading(false);
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <SettingLayout>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          
          <PageHeader
            type="detail"
            title="ユーザー詳細"
            onDeleteBtnClick={handleDelete}
            onEditBtnClick={handleEdit}
            onBackBtnClick={() => router.back()}
          />
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col xl:flex-row justify-center items-center w-full lg:w-8/12
            xl:w-10/12 xl:gap-x-[144px] xl:justify-start 2xl:w-8/12">
              <div className="flex justify-center items-center rounded-full w-24 h-24
              sm:w-[133px] sm:h-[133px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="rounded-full object-cover w-[96px] h-[96px]  sm:w-[133px] sm:h-[133px]"
                  alt="avatar"
                  src={
                    userData?.avatar
                      ? (userData.avatar.startsWith("images/") ? "/" : "") +
                        userData.avatar
                      : defaultAvt.src
                  }
                />
              </div>
              <div className="mt-8 w-full md:w-8/12 lg:w-full grid grid-cols-1 gap-y-6">
                <EachInput
                  title="名前"
                  detail={true}
                  content={
                    <div className="flex flex-col sm:flex-row">
                      {userData?.vietnamese_fullname}
                      <div className="flex">
                        <div className="px-5 hidden sm:block"> / </div>
                        <div>
                          {userData?.role == UserRole.NAITEISHA && "内定者"}
                          {userData?.role == UserRole.MENTOR && "メンター"}
                          {userData?.role == UserRole.TEACHER && "教師"}
                          {userData?.role == UserRole.CLIENT && "企業担当者"}
                        </div>
                      </div>
                    </div>
                    
                  }
                />
                <EachInput
                  title="名前（カタカナ)"
                  detail={true}
                  content={<div>{userData?.japanese_fullname}</div>}
                />
                <EachInput
                  title="メールアドレス"
                  detail={true}
                  content={<div>{userData?.email}</div>}
                />
              </div>
            </div>
            {userData?.role != UserRole.MENTOR && (
              <>
                <div className="text-center text-3xl font-medium py-12">
                  詳細
                </div>
                <div className="grid grid-cols-1 gap-y-6 w-full sm:w-3/5 lg:w-8/12 2xl:w-6/12">
                  {(userData?.role == UserRole.TEACHER ||
                    userData?.role == UserRole.NAITEISHA) && (
                    <EachInput
                      title="大学"
                      detail={true}
                      content={
                        <div className="w-96">{userData?.university_name}</div>
                      }
                    />
                  )}
                  {userData?.role == UserRole.NAITEISHA && (
                    <EachInput
                      title="年度コード"
                      detail={true}
                      content={
                        <div className="w-36">{userData?.grade_code}</div>
                      }
                    />
                  )}
                  {(userData?.role == UserRole.CLIENT ||
                    userData?.role == UserRole.NAITEISHA) && (
                    <EachInput
                      title="企業"
                      detail={true}
                      content={
                        <div className="w-96">{userData?.company_name}</div>
                      }
                    />
                  )}
                  {userData?.role == UserRole.NAITEISHA && (
                    <>
                      <EachInput
                        title="内定取得日"
                        detail={true}
                        content={
                          <div className="w-96">
                            {moment(userData.receive_naitei_date).format(
                              "YYYY/MM/DD"
                            )}
                          </div>
                        }
                      />
                      <EachInput
                        title="卒業予定日"
                        detail={true}
                        content={
                          <div className="w-96">
                            {moment(userData.graduation_date).format(
                              "YYYY/MM/DD"
                            )}
                          </div>
                        }
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </SettingLayout>
  );
};

export default UserDetail;
