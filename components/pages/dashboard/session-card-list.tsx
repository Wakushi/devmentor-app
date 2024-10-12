"use client"
import { Session } from "@/lib/types/session.type"
import { SessionCard } from "./session-card"
import { Role } from "@/lib/types/role.type"

export default function SessionCardList({
  sessions,
  viewerRole,
}: {
  sessions: Session[]
  viewerRole: Role
}) {
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {sessions?.map((session, i) => (
        <SessionCard
          key={"session-" + i}
          session={session}
          viewerRole={viewerRole}
        />
      ))}
    </div>
  )
}
