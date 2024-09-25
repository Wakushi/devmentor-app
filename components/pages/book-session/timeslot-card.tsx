import { Button } from "@/components/ui/button"
import { Timeslot } from "@/lib/types/timeslot.type"
import { getSlotStartHour } from "@/lib/utils"
import clsx from "clsx"

export default function TimeslotCard({
  timeslot,
  selected,
  handleSlotSelect,
  handleConfirmTimeslot,
}: {
  timeslot: Timeslot
  selected: boolean
  handleSlotSelect: (timeslot: Timeslot) => void
  handleConfirmTimeslot: (timeslot: Timeslot) => void
}) {
  function TimeDisplay() {
    return (
      <div
        className={clsx(
          "px-8 py-2 h-full font-semibold border-2 w-full text-center rounded cursor-pointer shadow-lg",
          {
            "hover:bg-slate-600": !selected,
            "bg-white text-primary-shade": selected,
          }
        )}
        key={timeslot.id}
        onClick={() => handleSlotSelect(timeslot)}
      >
        <span className="text-base">{getSlotStartHour(timeslot)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 h-[45px]">
      <TimeDisplay />
      {selected && (
        <Button
          onClick={() => handleConfirmTimeslot(timeslot)}
          className="fade-in-right h-full text-base px-8 py-2 cursor-pointer rounded shadow-lg"
        >
          Confirm
        </Button>
      )}
    </div>
  )
}
