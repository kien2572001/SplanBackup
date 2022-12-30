import React from "react";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";
import SkeletonInput from "antd/lib/skeleton/Input";
import SkeletonButton from "antd/lib/skeleton/Button";

export default function TestCartSkeleton() {
  return (
    <div
      className="rounded-sm flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl transition-all duration-300"
      style={{ border: "1px solid #d9d9d9" }}
    >
      <div className="flex flex-col items-center">
        <div className="mt-5 mb-6">
          <SkeletonAvatar size={160} shape="circle" active/>
        </div>

        <h5 className="font-medium max-w-[75%] truncate my-2"><SkeletonInput size="default" active/></h5>
      </div>

      <div
        className="w-full h-12 flex items-center"
        style={{ borderTop: "1px solid #d9d9d9" }}
      >
        <div
          className="group flex-1 h-12 flex justify-center items-center hover:text-danger transition-all"
          style={{ border: "none" }}
          //onClick={showConfirm}
        >
          <SkeletonButton size="small" active/>
        </div>
        <div
          className="flex flex-1 h-6 justify-center items-center text-center group hover:text-primary transition-all"
          style={{ borderLeft: "1px solid #d9d9d9" }}
        >
          <SkeletonButton size="small" active/>
        </div>
      </div>
    </div>
  );
}
