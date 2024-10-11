"use client"

import SessionCardList from "@/components/pages/dashboard/session-card-list"
import AnimatedBackground from "@/components/ui/animated-background"
import Loader from "@/components/ui/loader"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Mentor } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  const sessionsQuery = useSessionsQuery(user)

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="flex flex-col gap-4 p-4 pt-[8rem] min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold">
        Welcome back, {user.baseUser.userName} !
      </h1>

      <div className="w-[200px] mb-2">
        <NavLinkButton variant="filled" href="/mentor/availability">
          My availabilities <FaLongArrowAltRight />
        </NavLinkButton>
      </div>
      <div className="flex items-center gap-8">
        {matchQueryStatus(sessionsQuery, {
          Loading: (
            <div>
              <Loader />
            </div>
          ),
          Errored: <p>Something wrong happened</p>,
          Empty: (
            <div>
              <p>No sessions planned yet.</p>
            </div>
          ),
          Success: ({ data: sessions }) => (
            <section className="glass z-[2] flex flex-col gap-2 p-4 rounded-md w-fit">
              <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
              <SessionCardList sessions={sessions} viewerRole={user.role} />
            </section>
          ),
        })}
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
