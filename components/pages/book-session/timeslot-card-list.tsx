import { Timeslot } from "@/lib/types/timeslot.type"
import TimeslotCard from "./timeslot-card"

export default function TimeslotCardList({
  timeslots,
  selectedTimeslot,
  handleSlotSelect,
}: {
  timeslots: Timeslot[]
  selectedTimeslot?: Timeslot
  handleSlotSelect: (timeslot: Timeslot) => void
}) {
  if (!timeslots.length) {
    return null
  }

  return (
    <div className="flex flex-col self-stretch h-full gap-2 min-w-[280px]">
      {timeslots.map((slot) => (
        <TimeslotCard
          key={slot.id}
          timeslot={slot}
          selected={slot.id === selectedTimeslot?.id}
          handleSlotSelect={handleSlotSelect}
        />
      ))}
    </div>
  )
}
