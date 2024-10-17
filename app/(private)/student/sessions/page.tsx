"use client"

import { sessionsColumns } from "@/components/pages/sessions/sessions-table-columns"
import SessionsTable from "@/components/sessions-table"
import AnimatedBackground from "@/components/ui/animated-background"
import ErrorState from "@/components/ui/error-state"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
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
          console.log("sessions: ", sessions)
          return (
            <div className="flex flex-col gap-4 pt-[8rem] min-h-screen m-auto w-[95%]">
              <div className="flex flex-col">
                <h2 className="text-2xl">Sessions history</h2>
                <p className="text-small font-normal font-sans text-dim">
                  List of your past and future sessions
                </p>
              </div>
              <SessionsTable data={sessions} columns={sessionsColumns} />
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
          <h3>No pending approvals</h3>
          <p className="text-dim">
            There are currently no sessions waiting for approval.
          </p>
        </div>
        <div>
          <NavLinkButton variant="filled" href="/mentor/availability">
            Update my availabilities <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      </div>
    </div>
  )
}
