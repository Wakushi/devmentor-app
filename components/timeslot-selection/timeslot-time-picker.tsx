import { DaySlot } from "@/lib/types/timeslot.type"
import { TimeValue } from "react-aria"
import { TimePicker } from "../ui/time-picker"
import { IoRemove } from "react-icons/io5"

interface TimeslotPickerProps {
  dayIndex: number
  slot: DaySlot
  slotIndex: number
  active: boolean
  handleRemoveTimeslot: (dayIndex: number, slotIndex: number) => void
  handleTimeslotValueChange: ({
    dayIndex,
    slotIndex,
    type,
    value,
  }: {
    dayIndex: number
    slotIndex: number
    type: "timeStart" | "timeEnd"
    value: TimeValue
  }) => void
}

export default function TimeslotTimePicker({
  dayIndex,
  slot,
  slotIndex,
  active,
  handleRemoveTimeslot,
  handleTimeslotValueChange,
}: TimeslotPickerProps) {
  function timeStampToTimeValue(timestamp: number): TimeValue {
    const date = new Date(timestamp)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return {
      hour,
      minute,
    } as TimeValue
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 glass rounded px-4 py-2">
        <TimePicker
          value={timeStampToTimeValue(slot.timeStart)}
          onChange={(value) =>
            handleTimeslotValueChange({
              dayIndex,
              slotIndex,
              type: "timeStart",
              value,
            })
          }
          isDisabled={!active}
          label="Time start"
        />
        -
        <TimePicker
          value={timeStampToTimeValue(slot.timeEnd)}
          onChange={(value) =>
            handleTimeslotValueChange({
              dayIndex,
              slotIndex,
              type: "timeEnd",
              value,
            })
          }
          isDisabled={!active}
          label="Time end"
        />
      </div>
      {slotIndex > 0 && (
        <IoRemove
          onClick={() => handleRemoveTimeslot(dayIndex, slotIndex)}
          className="text-2xl cursor-pointer absolute right-[-40px] top-[10px] hover:text-destructive"
        />
      )}
    </div>
  )
}
