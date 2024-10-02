import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"
import { CiDollar } from "react-icons/ci"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from "react-icons/bs"
import HourlyRate from "@/components/hourly-rate"

export function SessionCard({ session }: { session: Session }) {
  const { timeStart } = session

  const name = "John Doe"
  const sessionPrice = session.mentor ? session.mentor.hourlyRate : null

  return (
    <div className="flex items-center justify-between gap-8 glass rounded px-4 py-2">
      <div className="flex items-center gap-4">
        <SessionMentor name={name} />
        <SessionTime timeStart={timeStart} />
      </div>
      <div className="flex items-center gap-8">
        <SessionPrice sessionPrice={sessionPrice} />
        <SessionOptions />
      </div>
    </div>
  )
}

function SessionMentor({ name }: { name: string }) {
  return (
    <div className="flex flex-col justify-center items-center">
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

function SessionTime({ timeStart }: { timeStart: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-small">
        <CalendarDays className="w-5 h-5" />
        <span className="text-dim">{formatDate(timeStart)}</span>
      </div>
      <div className="flex items-center gap-2 text-small">
        <Clock className="w-5 h-5" />
        <span className="text-dim">{formatTime(timeStart)}</span>
      </div>
    </div>
  )
}

function SessionPrice({ sessionPrice }: { sessionPrice: number | null }) {
  return (
    <div className="flex items-center text-sm text-gray-300">
      <HourlyRate hourlyRate={sessionPrice ?? 0} />
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
