import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Icon from "~/components/Icon";
import { showNotification } from "~/components/Notification";
import Logo from "~/assets/app-logo.svg";
import Image from "next/image";
import defaultAvatar from "~/assets/images/default-avatar.png";
import { Popover } from "antd";
import UserRole from "~/Enums/UserRole";
import ky from "~/api/ky";

const Navbar = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [firstAvailableNaiteishaId, setFirstAvailableNaiteishaId] = useState();
  const handleLogout = async () => {
    try {
      await ky.get("/api/auth/logout");
      localStorage.removeItem("currentUser");
      router.push(`/login`);
      showNotification({
        type: "success",
        title: "ログアウトが成功しました。",
      });
    } catch (error) {
      console.log("Logout false with error: ", error);
      router.push(`/login`);
      showNotification({
        type: "success",
        title: "ログアウトが成功しました。",
      });
    }
  };

  React.useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setAvatar(currentUser.avatar);
      setCurrentUserRole(currentUser.role);
    }
    const getFirstAvailableNaiteishaId = async () => {
      try {
        const response = await ky.get("/api/naiteishas/first-available-id").json();
        console.log('response', response);
        setFirstAvailableNaiteishaId(response.id);
      } catch (error) {
        console.log(error);
      }
    }
    getFirstAvailableNaiteishaId();
  }, []);

  const [visible, setVisible] = React.useState(false);
  const hide = () => {
    setVisible(false);
  };
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  return (
    <div
      style={{ borderBottom: "1px solid #ddd" }}
      className="h-16 mx-auto px-8 bg-white flex justify-between items-center shadow-md"
    >
      <Link href="/">
        <a className="hidden md:inline-block">
          <Image  src={Logo} alt="SPLAN" height={60} width={120}  />
        </a>
      </Link>
      {currentUserRole !== UserRole.SUPER_ADMIN && (
        <div className="flex gap-10 items-center">
          <Link href="/">
            <a > 
            <Icon name="house" size={24} className="md:hidden"/>
            <span className="  hidden md:text-lg md:font-extrabold md:inline-block">ホーム</span>
            </a>
          </Link>
          <Link href={`/naitei/${firstAvailableNaiteishaId}`}>
            <a >
            <Icon name="people-fill" size={24} className="md:hidden"/>
            <span className="hidden md:text-lg md:inline-block">内定者TOP</span></a>
          </Link>
          <Link href="/documents">
            <a >
            <Icon name="book" size={24} className="md:hidden"/>
            <span className="hidden md:text-lg md:inline-block">教材一覧</span></a>
          </Link>
          {currentUserRole === UserRole.MENTOR && (
            <Link href="/settings/users/naiteisha">
              <a>
              <Icon name="cog" size={24} className="md:hidden"/>
              <span className="hidden md:text-lg md:inline-block">設定</span></a>
            </Link>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 md:gap-5">
        <Icon className="hidden md:inline-block"  name="notification" size={28} />
        <Popover
          placement="bottomRight"
          content={
            <div className="flex flex-col items-end gap-2">
              <span className="text-base font-medium cursor-pointer hover:text-primary">
                プロフィール表示
              </span>
              <span
                className="text-base font-medium cursor-pointer hover:text-primary"
                onClick={() => handleLogout()}
              >
                ログアウト
              </span>
            </div>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <div className="avatar-container w-9 h-9 overflow-hidden rounded-full cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-full object-cover w-[36px] h-[36px]"
              alt="avatar"
              src={
                avatar
                  ? (avatar.startsWith("images/") ? "/" : "") + avatar
                  : defaultAvatar.src
              }
            />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
