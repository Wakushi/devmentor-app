import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { Button } from "@/components/ui/button"
import { Mentor, Student } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import { Role } from "@/lib/types/role.type"
import TooltipWrapper from "@/components/ui/custom-tooltip"

export enum SessionStatus {
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

interface StatusTooltips {
  [Role.STUDENT]: Record<SessionStatus, string>
  [Role.MENTOR]: Record<SessionStatus, string>
}

const statusTooltips: StatusTooltips = {
  [Role.STUDENT]: {
    [SessionStatus.PENDING_VALIDATION]:
      "Your session request is waiting for approval from the mentor. Once approved, it will be scheduled.",
    [SessionStatus.SCHEDULED]:
      "This session has been approved and is scheduled. Make sure to attend at the specified time.",
    [SessionStatus.EXPIRED]:
      "This session request was not approved in time and can no longer take place. You may need to submit a new request.",
    [SessionStatus.COMPLETED]:
      "This session has taken place and been confirmed by both you and the mentor.",
    [SessionStatus.PENDING_CONFIRMATION]:
      "This session has taken place. Please confirm your attendance if you haven't already.",
  },
  [Role.MENTOR]: {
    [SessionStatus.PENDING_VALIDATION]:
      "A new session request is waiting for your approval. Please review and respond promptly.",
    [SessionStatus.SCHEDULED]:
      "This session has been approved and is scheduled. Prepare for the upcoming session.",
    [SessionStatus.EXPIRED]:
      "This session request was not approved in time and can no longer take place.",
    [SessionStatus.COMPLETED]:
      "This session has taken place and been confirmed by both you and the student.",
    [SessionStatus.PENDING_CONFIRMATION]:
      "This session has taken place. Please confirm that it occurred if you haven't already.",
  },
}

export const statusColumn: ColumnDef<Session> = {
  id: "status",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  accessorFn: (row) => getSessionStatus(row),
  cell: ({ row }) => {
    const { user } = useUser() as { user: Student | Mentor }

    if (user.role === Role.VISITOR) return null

    const status = row.getValue("status") as SessionStatus
    const colorClass = statusColors[status]
    const tooltipMessage = statusTooltips[user.role][status]

    return (
      <TooltipWrapper message={tooltipMessage}>
        <div className="flex items-center gap-2 text-small">
          <span className={`w-3 h-3 ${colorClass} rounded-full`}></span>
          <span className="text-dim">{status}</span>
        </div>
      </TooltipWrapper>
    )
  },
  sortingFn: (rowA, rowB, columnId) => {
    const statusOrder = [
      SessionStatus.PENDING_VALIDATION,
      SessionStatus.SCHEDULED,
      SessionStatus.PENDING_CONFIRMATION,
      SessionStatus.COMPLETED,
      SessionStatus.EXPIRED,
    ]

    const statusA = rowA.getValue(columnId) as SessionStatus
    const statusB = rowB.getValue(columnId) as SessionStatus

    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
  },
  filterFn: (row, id, value) => {
    if (value === "" || value === "all") {
      return true
    }
    return row.getValue(id) === value
  },
}

function getSessionStatus(session: Session): SessionStatus {
  const { endTime, accepted, mentorConfirmed, studentConfirmed } = session
  const isPast = endTime < Date.now()

  if (!isPast) {
    return accepted ? SessionStatus.SCHEDULED : SessionStatus.PENDING_VALIDATION
  }

  if (!accepted) {
    return SessionStatus.EXPIRED
  }

  if (mentorConfirmed && studentConfirmed) {
    return SessionStatus.COMPLETED
  }

  return SessionStatus.PENDING_CONFIRMATION
}
