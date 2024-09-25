import { Button } from "@/components/ui/button"
import { Timeslot } from "@/lib/types/timeslot.type"
import { formatDate, formatTime } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"
import { MdEdit } from "react-icons/md"

export default function SelectedTimeslotCard({
  timeslot,
  handleEditTimeslot,
}: {
  timeslot: Timeslot
  handleEditTimeslot: () => void
}) {
  return (
    <Button
      onClick={handleEditTimeslot}
      className="flex items-center max-h-none justify-between w-full h-auto max-w-none p-4 rounded-md shadow-lg border-stone-800 hover:shadow-xl hover:bg-white hover:bg-opacity-[0.03] glass hover:opacity-80 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base">
          <CalendarDays className="w-5 h-5" />
          <span>{formatDate(timeslot.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-base">
          <Clock className="w-5 h-5" />
          <span>
            {formatTime(timeslot.startTime)} - {formatTime(timeslot.endTime)}
          </span>
        </div>
      </div>
      <MdEdit className="text-3xl" />
    </Button>
  )
}
