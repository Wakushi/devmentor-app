import { Session } from "@/lib/types/session.type"
import { ColumnDef } from "@tanstack/react-table"

export const topicColumn: ColumnDef<Session> = {
  accessorKey: "topic",
  header: "Topic",
  cell: ({ row }) => {
    const topic: string = row.getValue("topic")
    return (
      <div className="flex items-center gap-2 text-small text-dim">
        <span>{topic}</span>
      </div>
    )
  },
}
