import { Skeleton } from "antd"
import React from "react"

const C1CurrentSkillSkeleton = () => {
    return (
        <div className="w-[400px] px-8 shadow-md rounded-2xl flex flex-col items-center py-4 bg-white mb-2">
            <div className="flex justify-between self-start mb-4 text-primary w-full">
                <div className="flex gap-2">
                    <Skeleton.Avatar shape="square" active />
                    <Skeleton.Button active />
                </div>
                <Skeleton.Button active />
            </div>
            <div className="flex w-full flex-col gap-3 mt-2">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <Skeleton.Input active />
                        <Skeleton.Input size="small" active />
                    </div>
                    <Skeleton.Button active />
                </div>
                <Skeleton.Input size="small" active />
                <Skeleton.Input size="small" active />
            </div>
        </div>
    )
}

export default C1CurrentSkillSkeleton
