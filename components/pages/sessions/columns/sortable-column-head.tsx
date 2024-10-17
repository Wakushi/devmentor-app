import { Button } from "@/components/ui/button"
import { Session } from "@/lib/types/session.type"
import { Column } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export default function SortableColumnHead({
  column,
  title,
}: {
  column: Column<Session, unknown>
  title: string
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}
