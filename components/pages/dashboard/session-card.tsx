import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime, getInitials } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"

export function SessionCard({ session }: { session: Session }) {
  const { startTime } = session

  const name = "John Doe"

  return (
    <div className="flex items-center gap-4 glass rounded px-4 py-2">
      <SessionMentor name={name} />
      <SessionTime startTime={startTime} />
    </div>
  )
}

function SessionTime({ startTime }: { startTime: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-base">
        <CalendarDays className="w-5 h-5" />
        <span className="text-dim">{formatDate(startTime)}</span>
      </div>
      <div className="flex items-center gap-2 text-base">
        <Clock className="w-5 h-5" />
        <span className="text-dim">{formatTime(startTime)}</span>
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
