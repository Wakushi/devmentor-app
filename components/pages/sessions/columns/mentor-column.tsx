import { Session } from "@/lib/types/session.type"
import { Mentor } from "@/lib/types/user.type"
import { ColumnDef } from "@tanstack/react-table"
import { PiStudent } from "react-icons/pi"

export const mentorColumn: ColumnDef<Session> = {
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

    return mentor.baseUser.userName.toLowerCase().includes(value.toLowerCase())
  },
}
