"use client"

import { studentSessionsColumns } from "@/components/pages/sessions/session-columns/student-sessions-columns"
import SessionsTable from "@/components/sessions-table"
import AnimatedBackground from "@/components/ui/animated-background"
import ErrorState from "@/components/ui/error-state"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Role } from "@/lib/types/role.type"
import { Student } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import Image from "next/image"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function SessionsPage() {
  const { user, loadingUser } = useUser() as {
    user: Student
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
        Errored: <ErrorState onRetry={() => sessionsQuery.refetch()} />,
        Empty: <EmptyRequestsPage />,
        Success: ({ data: sessions }) => {
          return (
            <div className="flex flex-col gap-4 pt-[8rem] min-h-screen m-auto w-[95%]">
              <div className="flex flex-col">
                <h2 className="text-2xl">Sessions</h2>
                <p className="text-small font-normal font-sans text-dim">
                  List of your past and future sessions
                </p>
              </div>
              <SessionsTable
                data={sessions}
                columns={studentSessionsColumns}
                viewer={Role.STUDENT}
              />
            </div>
          )
        },
      })}

      <AnimatedBackground shader={false} />
    </>
  )
}

function EmptyRequestsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <Image
          width={300}
          height={300}
          src="/assets/search.gif"
          alt="Search icon"
          unoptimized
          priority
        />
        <div className="flex flex-col text-center mb-8">
          <h3>No session history</h3>
          <p className="text-dim">Let's book a session with a mentor !</p>
        </div>
        <div>
          <NavLinkButton variant="filled" href="/mentor/availability">
            Find a Mentor <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      </div>
    </div>
  )
}
