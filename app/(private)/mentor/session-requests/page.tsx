"use client"
import SessionRequestsTable from "@/components/pages/dashboard/mentor/session-requests-table/session-requests-table"
import { columns } from "@/components/pages/dashboard/mentor/session-requests-table/session-requests-table-columns"
import AnimatedBackground from "@/components/ui/animated-background"
import Loader from "@/components/ui/loader"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Mentor } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import Image from "next/image"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function SessionRequestsPage() {
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
    <div className="flex flex-col gap-4 pt-[8rem] min-h-screen m-auto w-[95%]">
      <div className="flex flex-col">
        <h2 className="text-2xl">Session requests</h2>
        <p className="text-small font-normal font-sans text-dim">
          List of students waiting for your approval to schedule a mentoring
          session
        </p>
      </div>
      {matchQueryStatus(sessionsQuery, {
        Loading: (
          <div className="w-[300px] h-[100px] flex justify-center items-center">
            <Loader />
          </div>
        ),
        Errored: <p>Something wrong happened</p>,
        Empty: (
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
        ),
        Success: ({ data: sessions }) => {
          const filteredSessions = sessions.filter(
            (session) => !session.accepted
          )

          return (
            <SessionRequestsTable data={filteredSessions} columns={columns} />
          )
        },
      })}

      <AnimatedBackground shader={false} />
    </div>
  )
}
