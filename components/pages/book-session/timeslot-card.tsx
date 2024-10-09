import { Button } from "@/components/ui/button"
import { getSlotStartHour } from "@/lib/utils"
import clsx from "clsx"

export default function TimeslotCard({
  dividedSlot,
  selected,
  handleSlotSelect,
  handleConfirmTimeslot,
}: {
  dividedSlot: number
  selected: boolean
  handleSlotSelect: (slot: number) => void
  handleConfirmTimeslot: (slot: number) => void
}) {
  function TimeDisplay() {
    return (
      <div
        className={clsx(
          "px-8 py-2 h-full font-semibold border-2 w-full text-center rounded-md cursor-pointer shadow-lg",
          {
            "hover:bg-slate-600": !selected,
            "bg-white text-primary-shade": selected,
          }
        )}
        key={dividedSlot}
        onClick={() => handleSlotSelect(dividedSlot)}
      >
        <span className="text-base">{getSlotStartHour(dividedSlot)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 h-[45px]">
      <TimeDisplay />
      {selected && (
        <Button
          onClick={() => handleConfirmTimeslot(dividedSlot)}
          className="fade-in-right h-full text-base px-8 py-2 cursor-pointer rounded-md shadow-lg"
        >
          Confirm
        </Button>
      )}
    </div>
  )
}
