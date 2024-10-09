import TimeslotCard from "./timeslot-card"

export default function TimeslotCardList({
  dividedSlots,
  selectedSlot,
  handleSlotSelect,
  handleConfirmTimeslot,
}: {
  dividedSlots: number[]
  selectedSlot?: number
  handleSlotSelect: (slot: number) => void
  handleConfirmTimeslot: (slot: number) => void
}) {
  if (!dividedSlots.length) {
    return null
  }

  return (
    <div className="relative flex flex-col self-stretch h-full min-w-[280px] fade-in-right">
      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 pb-4">
        {dividedSlots.map((slot) => (
          <TimeslotCard
            key={slot}
            dividedSlot={slot}
            selected={!!selectedSlot && slot === selectedSlot}
            handleSlotSelect={handleSlotSelect}
            handleConfirmTimeslot={handleConfirmTimeslot}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#343434] to-transparent pointer-events-none"></div>
    </div>
  )
}
