import React from "react"
import propTypes from "prop-types"
import Link from "next/link"
import Image from "next/image"
import defaultAvatar from "~/assets/images/default-avatar.png"

NaiteishaCard.propTypes = {
    userId: propTypes.number,
    name: propTypes.string,
    university: propTypes.string,
    company: propTypes.string,
    gradeCode: propTypes.string,
    graduateTime: propTypes.string,
    receiveNaiteiDate: propTypes.string,
    avatarUrl: propTypes.string,
}

export default function NaiteishaCard(props) {
    return (
        <>
            <Link href={`/naitei/${props.userId}`}>
                <a
                    className="naiteisha-card flex flex-col p-6 bg-white justify-center rounded-xl hover:text-default hover:shadow-xl hover:bg-slate-100 duration-300 transition-all"
                    style={{ width: "calc(50% - 10px)" }}
                >
                    <div className="card-top">
                        <div className="card-avatar rounded-full w-[96px] aspect-square overflow-hidden mx-auto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="object-cover w-[96px] h-[96px]"
                                alt="avatar"
                                src={
                                    props.avatarUrl
                                        ? (props.avatarUrl.startsWith("images/")
                                              ? "/"
                                              : "") + props.avatarUrl
                                        : defaultAvatar.src
                                }
                            />
                        </div>
                    </div>
                    <div className="card-content">
                        <h4 className="card-naitesha-name text-ellipsis overflow-hidden whitespace-nowrap mt-4 text-center">
                            {props.name}
                        </h4>
                        <p className="card-naiteisha-university text-center">
                            {props.university + ' / '+ props.gradeCode}
                        </p>
                        <p className="card-naiteisha-university text-center">
                            {props.company + ' / 内定 ' + props.receiveNaiteiDate}
                        </p>
                        <p className="card-naiteisha-university text-center">
                            卒{props.graduateTime}
                        </p>
                    </div>
                </a>
            </Link>
        </>
    )
}