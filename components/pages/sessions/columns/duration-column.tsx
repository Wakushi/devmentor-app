import { Session } from "@/lib/types/session.type"
import { formatTime } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Clock } from "lucide-react"

export const durationColumn: ColumnDef<Session> = {
  id: "duration",
  header: "Duration",
  cell: ({ row }) => {
    const { startTime, endTime } = row.original
    return (
      <div className="flex items-center gap-2 text-small text-dim">
        <Clock className="w-5 h-5" />
        <span>{formatTime(startTime)}</span>-<span>{formatTime(endTime)}</span>
      </div>
    )
  },
}
