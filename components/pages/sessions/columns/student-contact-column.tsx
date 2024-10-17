import StudentContactDialog from "@/components/student-contact-dialog"
import { Session } from "@/lib/types/session.type"
import { ColumnDef } from "@tanstack/react-table"
import { RiContactsBook3Fill } from "react-icons/ri"

export const studentContactColumn: ColumnDef<Session> = {
  accessorKey: "studentContactHash",
  header: "Contact",
  cell: ({ row }) => {
    const contactHash: string = row.getValue("studentContactHash")

    return (
      <StudentContactDialog contactHash={contactHash}>
        <RiContactsBook3Fill className="w-6 h-6 text-primary hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100" />
      </StudentContactDialog>
    )
  },
}
