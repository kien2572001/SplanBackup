import Head from "next/head"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import BackButton from "~/components/BackButton"
import Button from "~/components/Button"
import UserCard from "~/components/E1/E1-1/UserCard"
import Navbar from "~/components/layout/Navbar"
import SearchBar from "~/components/SearchBar"
import AuthContext from "~/contexts/AuthContext"
import UserRole from "~/Enums/UserRole"
import TopLayout from "~/components/layout/TopLayout"
import NaiteishaList from "~/components/B1/NaiteishaList"
import RecentPosts from "~/components/B1/RecentPosts"

export default function TOP() {
    const user = useContext(AuthContext)
    const router = useRouter()
    const [currentUserRole, setCurrentUserRole] = useState(null)
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"))
        if (currentUser) {
            setCurrentUserRole(currentUser.role)
        }
    }, [])
    useEffect(() => {
        if (currentUserRole === UserRole.SUPER_ADMIN) {
            router.push(`/settings/users/mentors`)
        }
    }, [currentUserRole, router])
    return (
        <div>
            {currentUserRole !== UserRole.SUPER_ADMIN && (
                <>
                    <Head>
                        <title>TOP</title>
                        <meta
                            name="TOP Page"
                            content="Homepage with recent posts and naiteisha list"
                        />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <TopLayout>
                        <div className="flex w-full">
                            <NaiteishaList />
                            <RecentPosts />
                        </div>
                    </TopLayout>
                </>
            )}
        </div>
    )
}
