"use client"

import SessionCardList from "@/components/pages/dashboard/session-card-list"
import SessionsPendingConfirmation from "@/components/pages/dashboard/sessions-pending-confirmation"
import AnimatedBackground from "@/components/ui/animated-background"
import Loader from "@/components/ui/loader"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  const sessionsQuery = useSessionsQuery(user, "students")

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="flex flex-col gap-4 p-4 pt-[8rem] min-h-screen m-auto w-[95%]">
      <h1 className="text-2xl font-bold">
        Welcome back, {user.baseUser.userName} !
      </h1>

      <div className="w-[200px] mb-2 relative z-[2]">
        <NavLinkButton variant="filled" href="/mentor/availability">
          My availabilities <FaLongArrowAltRight />
        </NavLinkButton>
      </div>
      <div className="flex items-center gap-8">
        {matchQueryStatus(sessionsQuery, {
          Loading: (
            <div className="w-[300px] h-[100px] flex justify-center items-center">
              <Loader />
            </div>
          ),
          Errored: <p>Something wrong happened</p>,
          Empty: (
            <div>
              <p>No sessions planned yet.</p>
            </div>
          ),
          Success: ({ data: sessions }) => {
            const incomingSessions = sessions.filter(
              (session) => session.endTime > Date.now()
            )

            const acceptedSessions = incomingSessions.filter(
              (session) => session.accepted
            )

            const pendingConfirmationSessions = sessions.filter((session) => {
              return (
                session.accepted &&
                session.endTime < Date.now() &&
                (!session.mentorConfirmed || !session.studentConfirmed)
              )
            })

            return (
              <div className="flex gap-8">
                {!!incomingSessions.length && (
                  <IncomingSessions
                    acceptedSessions={acceptedSessions}
                    user={user}
                  />
                )}
                {!!pendingConfirmationSessions.length && (
                  <SessionsPendingConfirmation
                    pendingConfirmationSessions={pendingConfirmationSessions}
                    user={user}
                  />
                )}
              </div>
            )
          },
        })}
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}

function IncomingSessions({
  acceptedSessions,
  user,
}: {
  acceptedSessions: Session[]
  user: Mentor | Student
}) {
  return (
    <section className="glass z-[2] flex flex-col gap-2 p-4 rounded-md w-fit">
      <div className="flex flex-col mb-2">
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        <p className="text-dim text-small">
          Accepted mentoring sessions on your horizon
        </p>
      </div>
      {acceptedSessions.length ? (
        <SessionCardList sessions={acceptedSessions} user={user} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <p className="text-small text-dim">No upcoming sessions.</p>
            <p className="text-small text-dim">
              You have some pending session requests
            </p>
          </div>
          <NavLinkButton variant="outline" href="/mentor/session-requests">
            Check pending requests {"->"}
          </NavLinkButton>
        </div>
      )}
    </section>
  )
}
