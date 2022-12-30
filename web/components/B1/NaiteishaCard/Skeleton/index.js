import React from "react"
import propTypes from "prop-types"
import Link from "next/link"
import Image from "next/image"
import defaultAvatar from "~/assets/images/default-avatar.png"
import { Skeleton } from "antd"

NaiteishaCardSkeleton.propTypes = {}

export default function NaiteishaCardSkeleton(props) {
    return (
        <>
            <div
                className="naiteisha-card flex flex-col p-6 bg-white justify-center rounded-xl hover:text-default hover:shadow-xl hover:bg-slate-100 duration-300 transition-all"
                style={{ width: "calc(50% - 10px)" }}
            >
                <div className="card-top">
                    <div className="card-avatar rounded-full w-[96px] aspect-square overflow-hidden mx-auto">
                        <Skeleton.Avatar size={96} active />
                    </div>
                </div>
                <div className="card-content">
                    <h4 className="card-naitesha-name text-ellipsis overflow-hidden whitespace-nowrap mt-4 text-center">
                        <Skeleton.Input size="default" active />
                    </h4>
                    <div className="my-1 text-center">
                        <Skeleton.Input size="small" active />
                    </div>
                    <div className="my-1 text-center">
                        <Skeleton.Input size="small" active />
                    </div>
                </div>
            </div>
        </>
    )
}
