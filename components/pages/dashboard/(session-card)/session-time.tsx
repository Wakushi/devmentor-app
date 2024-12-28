import { formatDate, formatTime } from "@/lib/utils"
import { FaCalendar, FaClock } from "react-icons/fa"

export default function SessionTime({
  startTime,
  endTime,
}: {
  startTime: number
  endTime: number
}) {
  return (
    <div className="flex flex-3 min-w-[190px] flex-col gap-2">
      <div className="flex items-center gap-2 text-small">
        <FaCalendar />
        <span className="text-dim text-nowrap">{formatDate(startTime)}</span>
      </div>
      <div className="flex items-center gap-2 text-small">
        <FaClock />
        <span className="text-dim">{formatTime(startTime)}</span>-
        <span className="text-dim">{formatTime(endTime)}</span>
      </div>
    </div>
  )
}
