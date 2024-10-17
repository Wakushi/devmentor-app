import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import { ColumnDef } from "@tanstack/react-table"
import SessionOptions from "../../dashboard/(session-card)/session-options"

export const actionColumn: ColumnDef<Session> = {
  id: "actions",
  cell: ({ row }) => {
    const { user } = useUser() as {
      user: Mentor | Student
    }

    const session: Session = row.original

    return <SessionOptions user={user} session={session} />
  },
}
