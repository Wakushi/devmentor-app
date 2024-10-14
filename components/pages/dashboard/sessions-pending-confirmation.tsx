import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import SessionCardList from "./session-card-list"

export default function SessionsPendingConfirmation({
  pendingConfirmationSessions,
  user,
}: {
  pendingConfirmationSessions: Session[]
  user: Mentor | Student
}) {
  return (
    <section className="glass z-[2] flex flex-col gap-2 p-4 rounded-md w-fit">
      <div className="flex flex-col mb-2">
        <h2 className="text-xl font-semibold">Past sessions</h2>
        <p className="text-dim text-small">
          Past sessions to review and confirm
        </p>
      </div>
      <SessionCardList sessions={pendingConfirmationSessions} user={user} />
    </section>
  )
}
