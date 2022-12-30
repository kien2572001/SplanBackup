import React from "react"
import defaultAvatar from "~/assets/images/default-avatar.png";
import { Skeleton } from 'antd';

function BSidebarSkeleton() {
  return (
    <div className="flex items-center hover:bg-gray-100 p-2 cursor-pointer">
      <div className="w-10 h-10">
        <Skeleton avatar active />
      </div>
      <div className="pl-2 w-[calc(100%-48px)] h-10">
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
      </div>
    </div>
  );
};

BSidebarSkeleton.propTypes = {}

export default BSidebarSkeleton
