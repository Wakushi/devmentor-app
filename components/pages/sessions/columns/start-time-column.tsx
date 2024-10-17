import { Session } from "@/lib/types/session.type"
import { ColumnDef } from "@tanstack/react-table"
import SortableColumnHead from "./sortable-column-head"
import { CalendarDays } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const startTimeColumn: ColumnDef<Session> = {
  accessorKey: "startTime",
  header: ({ column }) => {
    return <SortableColumnHead column={column} title="Date" />
  },
  cell: ({ row }) => {
    const startTime: number = row.getValue("startTime")
    return (
      <div className="flex items-center gap-2 text-small text-dim">
        <CalendarDays className="w-5 h-5" />
        <span className="text-dim">{formatDate(startTime)}</span>
      </div>
    )
  },
}
