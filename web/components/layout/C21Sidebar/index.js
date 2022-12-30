import { useRouter } from "next/router";
import React, { useEffect } from "react";
import SidebarItem from "./SidebarItem";
function C21SideBar(props) {
  const router = useRouter();
  return (
    <div>
      <SidebarItem
        href={`/naitei/${props.naiteiId}/basics/targets`}
        title="現在の目標"
        currentPath={router.asPath}
      />
      <SidebarItem
        href={`/naitei/${props.naiteiId}/basics/achievements`}
        title="達成済みの目標"
        currentPath={router.asPath}
      />
      <SidebarItem
        href={`/naitei/${props.naiteiId}/basics/class`}
        title="授業"
        currentPath={router.asPath}
      />
    </div>
  );
}

export default C21SideBar;
