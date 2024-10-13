"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import HourlyRate from "@/components/hourly-rate"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import {
  acceptSession,
  ContractEvent,
  watchForEvent,
  weiToUsd,
} from "@/services/contract.service"
import { Role } from "@/lib/types/role.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { FaCircleCheck } from "react-icons/fa6"
import { useQueryClient } from "@tanstack/react-query"
import { GoGoal } from "react-icons/go"
import StudentContactDialog from "@/components/student-contact-dialog"
import { RiContactsBook3Fill } from "react-icons/ri"
import StudentGoalsDialog from "@/components/student-goals-dialog"
import { FaBook, FaCalendar } from "react-icons/fa"
import { FaClock } from "react-icons/fa6"
import { IoIosMore } from "react-icons/io"

export function SessionCard({
  user,
  session,
}: {
  user: Mentor | Student
  session: Session
}) {
  const { startTime, endTime, valueLocked, mentor, student, topic } = session

  function isMentorView(): boolean {
    return user.role === Role.MENTOR
  }

  return (
    <div className="flex items-center justify-between gap-8 glass rounded-md px-4 py-2">
      <div className="flex items-center gap-6">
        <SessionPeer
          name={
            isMentorView()
              ? student?.baseUser?.userName
              : mentor?.baseUser?.userName
          }
        />
        <SessionTime startTime={startTime} endTime={endTime} />
        <div className="flex flex-col gap-2">
          <SessionTopic topic={topic} />
          <SessionPrice sessionPriceWei={valueLocked} />
        </div>
        <div className="flex flex-col gap-2">
          {user.role === Role.MENTOR && (
            <>
              <StudentGoalsDialog sessionGoalHash={session.sessionGoalHash}>
                <div className="flex items-center gap-2 text-dm-accent">
                  <GoGoal />
                  <span className="text-small hover:underline">Objectives</span>
                </div>
              </StudentGoalsDialog>

              <StudentContactDialog contactHash={session.studentContactHash}>
                <div className="flex items-center gap-2 text-primary">
                  <RiContactsBook3Fill />
                  <span className="text-small hover:underline">
                    Student contact
                  </span>
                </div>
              </StudentContactDialog>
            </>
          )}
        </div>
      </div>
      {user.role === Role.MENTOR && (
        <SessionOptions session={session} user={user} />
      )}
    </div>
  )
}

function SessionPeer({ name = "Anon" }: { name?: string }) {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}`}
          alt={name}
        />
        <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
      </Avatar>
      <span className="text-small">{name}</span>
    </div>
  )
}

function SessionTopic({ topic }: { topic: string }) {
  return (
    <div className="flex items-center gap-2">
      <FaBook />
      <span className="text-small text-dim">{topic}</span>
    </div>
  )
}

function SessionTime({
  startTime,
  endTime,
}: {
  startTime: number
  endTime: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-small">
        <FaCalendar />
        <span className="text-dim">{formatDate(startTime)}</span>
      </div>
      <div className="flex items-center gap-2 text-small">
        <FaClock />
        <span className="text-dim">{formatTime(startTime)}</span>-
        <span className="text-dim">{formatTime(endTime)}</span>
      </div>
    </div>
  )
}

function SessionPrice({ sessionPriceWei }: { sessionPriceWei: number }) {
  const ethPriceQuery = useEthPriceQuery()
  const { data: ethPrice } = ethPriceQuery
  const sessionPriceUsd = weiToUsd(sessionPriceWei, ethPrice ?? 0)

  return <HourlyRate hourlyRate={sessionPriceUsd} />
}

function SessionOptions({
  user,
  session,
}: {
  session: Session
  user: Mentor | Student
}) {
  const queryClient = useQueryClient()

  function isPastSession(): boolean {
    return session.endTime > Date.now()
  }

  async function handleRevokeSession(): Promise<void> {
    if (!user || session.id === undefined) return

    try {
      toast({
        title: "Pending confirmation...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      await acceptSession({
        account: user.account,
        accepted: false,
        sessionId: session.id,
      })

      toast({
        title: "Revoking session...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.SESSION_VALIDATED,
        args: { mentorAccount: user.account },
        handler: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.SESSIONS, user?.account],
          })

          toast({
            title: "Success",
            description: "Session approval revoked successfully",
            action: <FaCircleCheck className="text-white" />,
          })
        },
      })
    } catch (error: any) {
      console.log("error: ", error)
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something wrong happened !",
      })
    }
  }

  async function handleConfirmSession(): Promise<void> {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IoIosMore />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-dim text-white">
        {isPastSession() ? (
          <>
            <DropdownMenuItem
              className="flex drop-shadow-lg justify-center cursor-pointer"
              onClick={handleConfirmSession}
            >
              Confirm session
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="flex drop-shadow-lg justify-center cursor-pointer"
              onClick={handleRevokeSession}
            >
              Revoke session
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
