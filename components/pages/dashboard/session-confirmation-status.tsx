import TooltipWrapper from "@/components/ui/custom-tooltip"
import { Role } from "@/lib/types/role.type"
import { Session } from "@/lib/types/session.type"
import React from "react"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export default function SessionConfirmationStatus({
  session,
  currentUserRole,
}: {
  session: Session
  currentUserRole: Role
}) {
  const isMentor = currentUserRole === Role.MENTOR
  const peerName = isMentor ? "Student" : "Mentor"

  const userConfirmed = isMentor
    ? session.mentorConfirmed
    : session.studentConfirmed

  const peerConfirmed = isMentor
    ? session.studentConfirmed
    : session.mentorConfirmed

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {userConfirmed ? (
          <TooltipWrapper side="left" message="Confirmed">
            <FaCheckCircle className="text-green-500" />
          </TooltipWrapper>
        ) : (
          <TooltipWrapper side="left" message="Pending confirmation">
            <FaTimesCircle className="text-red-500" />
          </TooltipWrapper>
        )}
        <span className="text-small text-dim">You</span>
      </div>
      <div className="flex items-center gap-1">
        {peerConfirmed ? (
          <TooltipWrapper side="left" message="Confirmed">
            <FaCheckCircle className="text-green-500" />
          </TooltipWrapper>
        ) : (
          <TooltipWrapper side="left" message="Pending confirmation">
            <FaTimesCircle className="text-red-500" />
          </TooltipWrapper>
        )}
        <span className="text-small text-dim">{peerName}</span>
      </div>
    </div>
  )
}
