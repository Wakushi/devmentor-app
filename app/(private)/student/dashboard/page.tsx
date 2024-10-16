"use client"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { FaLongArrowAltRight } from "react-icons/fa"
import SessionCardList from "@/components/pages/dashboard/session-card-list"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import Image from "next/image"
import { Student } from "@/lib/types/user.type"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import SessionsPendingConfirmation from "@/components/pages/dashboard/sessions-pending-confirmation"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: Student | null
    loadingUser: boolean
  }

  const mentorsQuery = useMentorsQuery()
  const { data: mentors, isLoading: loadingMentors } = mentorsQuery
  const sessionsQuery = useSessionsQuery(user, "mentors", mentors)

  if (loadingUser || loadingMentors) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <>
      {matchQueryStatus(sessionsQuery, {
        Loading: <LoadingScreen />,
        Errored: <p>Something wrong happened</p>,
        Empty: <EmptyDashboard />,
        Success: ({ data: sessions }) => {
          const incomingSession = sessions.filter(
            (session) => session.endTime > Date.now()
          )

          const pendingAcceptanceSessions = incomingSession.filter(
            (session) => !session.accepted
          )

          const acceptedSessions = incomingSession.filter(
            (session) => session.accepted
          )

          const pendingConfirmationSessions = sessions.filter((session) => {
            return (
              session.endTime < Date.now() &&
              (!session.mentorConfirmed || !session.studentConfirmed)
            )
          })

          return (
            <div className="min-h-screen flex flex-col gap-6 max-w-[95%] mx-auto w-full pt-header-distance">
              <div className="flex w-full items-center gap-8">
                <h1 className="text-2xl font-bold">
                  Welcome back, {user.baseUser.userName} !
                </h1>
                <div className="relative z-[2]">
                  <NavLinkButton
                    variant="filled-secondary"
                    href="/student/mentor-search"
                  >
                    Find a Mentor <FaLongArrowAltRight />
                  </NavLinkButton>
                </div>
              </div>
              <div className="flex gap-4">
                {!!pendingAcceptanceSessions.length && (
                  <section className="glass z-[2] flex flex-col gap-2 p-4 rounded-md w-fit h-fit">
                    <div className="flex flex-col mb-2">
                      <h2 className="text-xl font-semibold">
                        Sessions requests
                      </h2>
                      <p className="text-dim text-small">
                        Sessions waiting for mentor review and confirmation
                      </p>
                    </div>
                    <SessionCardList
                      sessions={pendingAcceptanceSessions}
                      user={user}
                    />
                  </section>
                )}
                {!!acceptedSessions.length && (
                  <section className="glass z-[2] flex flex-col gap-2 p-4 rounded-md w-fit h-fit">
                    <div className="flex flex-col mb-2">
                      <h2 className="text-xl font-semibold">
                        Upcoming Sessions
                      </h2>
                      <p className="text-dim text-small">
                        Upcoming sessions validated by mentors
                      </p>
                    </div>
                    <SessionCardList sessions={acceptedSessions} user={user} />
                  </section>
                )}
                {!!pendingConfirmationSessions.length && (
                  <SessionsPendingConfirmation
                    pendingConfirmationSessions={pendingConfirmationSessions}
                    user={user}
                  />
                )}
              </div>
            </div>
          )
        },
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
        priority
      />
      <div className="flex flex-col text-center mb-8">
        <h3>No upcoming sessions</h3>
        <p className="text-dim">Let's book a session with a mentor !</p>
      </div>
      <div>
        <NavLinkButton variant="filled" href="/student/mentor-search">
          Find a Mentor <FaLongArrowAltRight />
        </NavLinkButton>
      </div>
    </div>
  )
}
