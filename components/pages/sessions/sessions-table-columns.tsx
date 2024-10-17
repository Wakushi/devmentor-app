"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CalendarDays, Clock } from "lucide-react"
import { Mentor, Student } from "@/lib/types/user.type"
import { PiStudent } from "react-icons/pi"
import { GoGoal } from "react-icons/go"
import { useUser } from "@/stores/user.store"
import StudentGoalsDialog from "@/components/student-goals-dialog"
import { Role } from "@/lib/types/role.type"
import SessionOptions from "../dashboard/(session-card)/session-options"
import { statusColumn } from "./columns/status-column"

export const sessionsColumns: ColumnDef<Session>[] = [
  {
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
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const { startTime, endTime } = row.original
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <Clock className="w-5 h-5" />
          <span>{formatTime(startTime)}</span>-
          <span>{formatTime(endTime)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      const topic: string = row.getValue("topic")
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <span>{topic}</span>
        </div>
      )
    },
  },
  {
    id: "mentor",
    header: "Mentor",
    cell: ({ row }) => {
      const mentor: Mentor | undefined = row.original.mentor
      const mentorName = mentor ? mentor.baseUser.userName : "Anon"
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <PiStudent className="w-5 h-5" />
          <span>{mentorName}</span>
        </div>
      )
    },
    accessorFn: (row) => row.mentor,
    filterFn: (row, id, value) => {
      if (!value) return true

      const mentor: Mentor = row.getValue(id)

      return mentor.baseUser.userName
        .toLowerCase()
        .includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "sessionGoalHash",
    header: "Objectives",
    cell: ({ row }) => {
      const sessionGoalHash: string = row.getValue("sessionGoalHash")

      return (
        <StudentGoalsDialog
          sessionGoalHash={sessionGoalHash}
          viewer={Role.STUDENT}
        >
          <GoGoal className="w-6 h-6 text-dm-accent hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100 cursor-pointer" />
        </StudentGoalsDialog>
      )
    },
  },
  statusColumn,
  {
    id: "actions",
    cell: ({ row }) => {
      const { user } = useUser() as {
        user: Mentor | Student
      }

      const session: Session = row.original

      return <SessionOptions user={user} session={session} />
    },
  },
]

function SortableColumnHead({
  column,
  title,
}: {
  column: Column<Session, unknown>
  title: string
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}
