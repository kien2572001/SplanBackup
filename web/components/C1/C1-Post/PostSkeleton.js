import React from "react"
import moment from "moment"
import PropTypes from "prop-types"
import "moment/locale/ja"
import { Skeleton } from "antd"
import SkeletonButton from "antd/lib/skeleton/Button"

moment.locale("ja")

/* eslint-disable-next-line react/display-name */
const C1PostSkeleton = (props) => {
    return (
        <div
            className={`flex flex-col w-full bg-white items-stretch pl-4 px-8 py-4 rounded-xl text-default ${ !props.showShadow ? "" : "shadow-md" }`}
            style={{ border: `${!props.showBorder ? "none" : "1px solid #ddd"}` }}
        >
            <div className="post-top flex items-center justify-between w-full mb-2">
                <div className="post-top-left flex items-center gap-3">
                    <div className="avatar w-12 h-12 rounded-full overflow-hidden">
                        <Skeleton avatar={{ size: 48 }} active />
                    </div>
                    <div className="naiteisha-name font-bold">
                        <Skeleton.Input size="small" active />
                    </div>
                </div>
                <div className="post-top-right">
                    <Skeleton.Input size="small" active />
                </div>
            </div>

            <div className="post-body pl-12 w-full">
                <div className="memo-container w-full text-start mb-3">
                    <Skeleton.Input size="large" active />
                </div>
                <div
                    className="post-content-container rounded-lg px-4 py-4 w-full"
                    style={{ border: "1px solid #ddd", cursor: "pointer" }}
                >
                    <Skeleton paragraph={{ rows: 3 }} title={false} active />
                </div>
            </div>

            <div className="post-bottom pl-[80px] flex justify-center gap-[40px] mt-3">
                <div className="flex gap-2">
                    <Skeleton.Avatar shape="square" active />
                    <Skeleton.Button active />
                </div>
                <div className="flex gap-2">
                    <Skeleton.Avatar shape="square" active />
                    <Skeleton.Button active />
                </div>
            </div>
        </div>
    )
}

C1PostSkeleton.propTypes = {
    showShadow: PropTypes.bool,
    showBorder: PropTypes.bool,
}

C1PostSkeleton.defaultProps = {
    showShadow: true,
    showBorder: true,
}

export default C1PostSkeleton
