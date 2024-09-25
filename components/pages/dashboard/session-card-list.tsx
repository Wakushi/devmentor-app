import { Session } from "@/lib/types/session.type"
import { SessionCard } from "./session-card"

export default function SessionCardList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="space-y-2">
      {sessions?.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
