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
import TooltipWrapper from "@/components/ui/custom-tooltip"

enum SessionStatus {
  PENDING_VALIDATION = "Awaiting Approval",
  SCHEDULED = "Scheduled",
  EXPIRED = "Expired",
  COMPLETED = "Completed",
  PENDING_CONFIRMATION = "Pending Confirmation",
}

const statusColors: Record<SessionStatus, string> = {
  [SessionStatus.PENDING_VALIDATION]: "bg-yellow-400",
  [SessionStatus.SCHEDULED]: "bg-blue-400",
  [SessionStatus.EXPIRED]: "bg-red-400",
  [SessionStatus.COMPLETED]: "bg-green-400",
  [SessionStatus.PENDING_CONFIRMATION]: "bg-purple-400",
}

const statusTooltips: Record<SessionStatus, string> = {
  [SessionStatus.PENDING_VALIDATION]:
    "This session is waiting for approval. Once approved, it will be scheduled.",
  [SessionStatus.SCHEDULED]:
    "This session has been approved and is scheduled to take place in the future.",
  [SessionStatus.EXPIRED]:
    "This session was not approved before its scheduled time and can no longer take place.",
  [SessionStatus.COMPLETED]:
    "This session has taken place and been confirmed by both the mentor and student.",
  [SessionStatus.PENDING_CONFIRMATION]:
    "This session has taken place but is waiting for confirmation from either the mentor or the student.",
}

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
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Session } }) => {
      const status = getSessionStatus(row.original)
      const colorClass = statusColors[status]
      const tooltip = statusTooltips[status]

      function getSessionStatus(session: Session): SessionStatus {
        const { endTime, accepted, mentorConfirmed, studentConfirmed } = session
        const isPast = endTime < Date.now()

        if (!isPast) {
          return accepted
            ? SessionStatus.SCHEDULED
            : SessionStatus.PENDING_VALIDATION
        }

        if (!accepted) {
          return SessionStatus.EXPIRED
        }

        if (mentorConfirmed && studentConfirmed) {
          return SessionStatus.COMPLETED
        }

        return SessionStatus.PENDING_CONFIRMATION
      }

      return (
        <TooltipWrapper message={tooltip}>
          <div className="flex items-center gap-2 text-small">
            <span className={`w-3 h-3 ${colorClass} rounded-full`}></span>
            <span className="text-dim">{status}</span>
          </div>
        </TooltipWrapper>
      )
    },
  },
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
