import { Session } from "@/lib/types/session.type"
import { Student } from "@/lib/types/user.type"
import { ColumnDef } from "@tanstack/react-table"
import { PiStudent } from "react-icons/pi"

export const studentColumn: ColumnDef<Session> = {
  id: "student",
  header: "Student",
  cell: ({ row }) => {
    const student: Student | undefined = row.original.student
    const studentName = student ? student.baseUser.userName : "Anon"
    return (
      <div className="flex items-center gap-2 text-small text-dim">
        <PiStudent className="w-5 h-5" />
        <span>{studentName}</span>
      </div>
    )
  },
  accessorFn: (row) => row.student,
  filterFn: (row, id, value) => {
    if (!value) return true

    const student: Student = row.getValue(id)

    return student.baseUser.userName.toLowerCase().includes(value.toLowerCase())
  },
}
