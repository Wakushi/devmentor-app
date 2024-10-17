import StudentGoalsDialog from "@/components/student-goals-dialog"
import { Session } from "@/lib/types/session.type"
import { ColumnDef } from "@tanstack/react-table"
import { GoGoal } from "react-icons/go"

export const goalColumn: ColumnDef<Session> = {
  accessorKey: "sessionGoalHash",
  header: "Objectives",
  cell: ({ row }) => {
    const sessionGoalHash: string = row.getValue("sessionGoalHash")

    return (
      <StudentGoalsDialog sessionGoalHash={sessionGoalHash}>
        <GoGoal className="w-6 h-6 text-dm-accent hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100 cursor-pointer" />
      </StudentGoalsDialog>
    )
  },
}
