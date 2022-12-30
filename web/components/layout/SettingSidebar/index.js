import { useRouter } from "next/router";
import React from "react";
import SidebarItem from "./SidebarItem";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import UserRole from "~/Enums/UserRole";
function SettingSidebar(props) {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState(0);
  useEffect(() => {
    setCurrentUserRole(JSON.parse(localStorage.getItem("currentUser")).role);
  }, []);
  return (
    <div
      className={
        "setting-sidebar bg-white h-full flex flex-col gap-4 shadow-lg w-16 lg:w-full " +
        (props.minimized ? "" : "p-3 lg:p-6")
      }
    >
      <SidebarItem
        href={"/settings/users"}
        title="ユーザ設定"
        iconName="people-fill"
        currentPath={router.asPath}
        minimized={props.minimized}
        bigSideBar = {true}
      />
      {currentUserRole === UserRole.MENTOR && (
        <>
          <SidebarItem
            href="/settings/enterprises"
            title="企業設定"
            iconName="building"
            currentPath={router.asPath}
            minimized={props.minimized}
            bigSideBar = {true}
          />
          <SidebarItem
            href="/settings/universities"
            title="大学設定"
            iconName="school"
            currentPath={router.asPath}
            minimized={props.minimized}
            bigSideBar = {true}
          />
          <SidebarItem
            href="/settings/class"
            title="授業設定"
            iconName="door-open-fill"
            currentPath={router.asPath}
            minimized={props.minimized}
            bigSideBar = {true}
          />
          <SidebarItem
            href="/settings/exams"
            title="試験設定"
            iconName="file-text"
            currentPath={router.asPath}
            minimized={props.minimized}
            bigSideBar = {true}
          />
          <SidebarItem
            href="/settings/category"
            title="カテゴリー設定"
            iconName="category"
            currentPath={router.asPath}
            minimized={props.minimized}
            bigSideBar = {true}
          />
        </>
      )}
    </div>
  );
}

SettingSidebar.propTypes = {
  minimized: PropTypes.bool,
};

export default SettingSidebar;
