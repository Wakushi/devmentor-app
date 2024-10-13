"use client"
import { Session } from "@/lib/types/session.type"
import { SessionCard } from "./session-card"
import { Mentor, Student } from "@/lib/types/user.type"

export default function SessionCardList({
  user,
  sessions,
}: {
  user: Mentor | Student
  sessions: Session[]
}) {
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {sessions?.map((session, i) => (
        <SessionCard key={"session-" + i} session={session} user={user} />
      ))}
    </div>
  )
}
