"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import { CalendarDays, Clock, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export function SessionCard({
  user,
  session,
}: {
  user: Mentor | Student
  session: Session
}) {
  const { startTime, endTime, valueLocked, mentor, student } = session

  function isMentorView(): boolean {
    return user.role === Role.MENTOR
  }

  return (
    <div className="flex items-center justify-between gap-8 glass rounded-md px-4 py-2">
      <div className="flex items-center gap-4">
        <SessionPeer
          name={
            isMentorView()
              ? student?.baseUser?.userName
              : mentor?.baseUser?.userName
          }
        />
        <SessionTime startTime={startTime} endTime={endTime} />
      </div>
      <div className="flex items-center gap-8">
        {!isMentorView() && <SessionPrice sessionPriceWei={valueLocked} />}
        <SessionOptions session={session} user={user} />
      </div>
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
        <CalendarDays className="w-5 h-5" />
        <span className="text-dim">{formatDate(startTime)}</span>
      </div>
      <div className="flex items-center gap-2 text-small">
        <Clock className="w-5 h-5" />
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

  return (
    <div className="flex items-center text-sm text-gray-300">
      <HourlyRate hourlyRate={sessionPriceUsd} />
    </div>
  )
}

function SessionOptions({
  user,
  session,
}: {
  session: Session
  user: Mentor | Student
}) {
  const queryClient = useQueryClient()

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-dim text-white">
        <DropdownMenuItem
          className="flex drop-shadow-lg justify-center cursor-pointer"
          onClick={handleRevokeSession}
        >
          Revoke session
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
