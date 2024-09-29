import { Button } from "@/components/ui/button"
import { MdEdit } from "react-icons/md"

export default function SessionGoalEditable({
  sessionGoals,
  handleEditSessionGoals,
}: {
  sessionGoals: string
  handleEditSessionGoals: () => void
}) {
  return (
    <Button
      onClick={handleEditSessionGoals}
      className="flex text-balance text-left items-center max-h-none border-none justify-between w-full h-auto max-w-none p-4 rounded-md shadow-lg hover:shadow-xl hover:bg-white hover:bg-opacity-[0.03] glass hover:opacity-80 cursor-pointer"
    >
      <p className="font-normal max-w-[90%]">{sessionGoals}</p>
      <MdEdit className="text-3xl" />
    </Button>
  )
}
