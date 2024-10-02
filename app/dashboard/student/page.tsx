"use client"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { FaLongArrowAltRight } from "react-icons/fa"
import SessionCardList from "@/components/pages/dashboard/session-card-list"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import Loader from "@/components/ui/loader"
import Image from "next/image"
import { Student } from "@/lib/types/user.type"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: Student | null
    loadingUser: boolean
  }
  const sessionsQuery = useSessionsQuery(user)

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <>
      {matchQueryStatus(sessionsQuery, {
        Loading: (
          <div className="min-h-screen flex justify-center items-center">
            <Loader />
          </div>
        ),
        Errored: <p>Something wrong happened</p>,
        Empty: <EmptyDashboard />,
        Success: ({ data: sessions }) => (
          <div className="min-h-screen flex flex-col gap-6 max-w-[95%] mx-auto w-full pt-header-distance">
            <div className="flex w-full items-center gap-8">
              <h1 className="text-2xl font-bold">
                Welcome back, {user.baseUser.userName} !
              </h1>
              <div>
                <NavLinkButton variant="filled-secondary" href="/mentor-search">
                  Find a Mentor <FaLongArrowAltRight />
                </NavLinkButton>
              </div>
            </div>
            <section className="glass flex flex-col gap-2 p-4 rounded w-fit">
              <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
              <SessionCardList sessions={sessions} />
            </section>
          </div>
        ),
      })}
      <AnimatedBackground shader={false} />
    </>
  )
}

function EmptyDashboard() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Image
        width={300}
        height={300}
        src="/assets/search.gif"
        alt="Search icon"
        unoptimized
      />
      <div className="flex flex-col text-center mb-8">
        <h3>No upcoming sessions</h3>
        <p className="text-dim">Let's book a session with a mentor !</p>
      </div>
      <div>
        <NavLinkButton variant="filled" href="/mentor-search">
          Find a Mentor <FaLongArrowAltRight />
        </NavLinkButton>
      </div>
    </div>
  )
}
