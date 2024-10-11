"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from "react-icons/bs"
import HourlyRate from "@/components/hourly-rate"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"
import { Role } from "@/lib/types/role.type"

export function SessionCard({
  session,
  viewerRole,
}: {
  session: Session
  viewerRole: Role
}) {
  const { startTime, endTime, valueLocked, mentor, student } = session

  function isMentorView(): boolean {
    return viewerRole === Role.MENTOR
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
        <SessionOptions />
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

function SessionOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-dim text-white">
        <DropdownMenuItem className="flex drop-shadow-lg justify-center cursor-pointer">
          Report an issue
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-dim" />
        <DropdownMenuItem className="flex drop-shadow-lg justify-center cursor-pointer focus:bg-destructive">
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
