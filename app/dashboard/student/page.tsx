"use client"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { FaLongArrowAltRight } from "react-icons/fa"
import SessionCardList from "@/components/pages/dashboard/session-card-list"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { SessionCardSkeleton } from "@/components/pages/dashboard/session-card"

export default function DashboardPage() {
  const { user, loadingUser } = useUser()
  const sessionsQuery = useSessionsQuery(user)

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name} !</h1>

      <div className="flex gap-4">
        <section className="glass border border-stone-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          {matchQueryStatus(sessionsQuery, {
            Loading: (
              <div className="flex flex-col gap-4">
                <SessionCardSkeleton />
                <SessionCardSkeleton />
                <SessionCardSkeleton />
              </div>
            ),
            Errored: <p>Something wrong happened</p>,
            Empty: <p>No session booked for now.</p>,
            Success: ({ data: sessions }) => (
              <SessionCardList sessions={sessions} />
            ),
          })}
        </section>

        <section className="glass border h-fit border-stone-800 p-4 rounded-md shadow fade-in-bottom">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <div className="w-full">
              <NavLinkButton variant="filled" href="/mentor-search">
                Find a Mentor <FaLongArrowAltRight />
              </NavLinkButton>
            </div>
          </div>
        </section>
      </div>

      <AnimatedBackground shader={false} />
    </div>
  )
}
