import { Button } from "@/components/ui/button"
import { MdEdit } from "react-icons/md"
import { GoGoal } from "react-icons/go"
import { BookStep } from "@/app/book-session/page"

export default function SessionGoalEditable({
  sessionGoals,
  handleEditStep,
}: {
  sessionGoals: string
  handleEditStep: (step: BookStep) => void
}) {
  return (
    <Button
      onClick={() => handleEditStep(BookStep.OBJECTIVES)}
      className="flex text-balance text-left items-center max-h-none border-none justify-between w-full h-auto max-w-none p-4 rounded-md shadow-lg hover:shadow-xl hover:bg-white hover:bg-opacity-[0.03] glass hover:opacity-80 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <GoGoal className="w-5 h-5" />
          <h3 className="text-body font-sans">Objectives</h3>
        </div>
        <p className="font-normal w-[550px]">{sessionGoals}</p>
      </div>
      <MdEdit className="text-3xl" />
    </Button>
  )
}
