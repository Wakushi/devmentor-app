import { BookStep } from "@/app/book-session/page"
import { Button } from "@/components/ui/button"
import { Timeslot } from "@/lib/types/timeslot.type"
import { formatDate, formatTime } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"
import { MdEdit } from "react-icons/md"

export default function SelectedTimeslotCard({
  timeslot,
  handleEditStep,
}: {
  timeslot: Timeslot
  handleEditStep: (step: BookStep) => void
}) {
  return (
    <Button
      onClick={() => handleEditStep(BookStep.SCHEDULE)}
      className="flex text-balance text-left items-center max-h-none border-none justify-between w-full h-auto max-w-none p-4 rounded-md shadow-lg hover:shadow-xl hover:bg-white hover:bg-opacity-[0.03] glass hover:opacity-80 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <CalendarDays className="w-5 h-5" />
          <h3 className="text-body font-sans">Date and time</h3>
        </div>
        <p className="font-normal w-[550px]">
          <span>{formatDate(timeslot.date)}</span>,{" "}
          <span>
            {formatTime(timeslot.timeStart)} to {formatTime(timeslot.timeEnd)}
          </span>
        </p>
      </div>
      <MdEdit className="text-3xl" />
    </Button>
  )
}
