import { DayOfWeek } from "@/lib/types/timeslot.type"
import clsx from "clsx"
import { TimeValue } from "react-aria"
import { Switch } from "../ui/switch"
import TimeslotTimePicker from "./timeslot-time-picker"
import { IoAdd } from "react-icons/io5"

interface DayOfWeekCardProps {
  day: DayOfWeek
  handleAddTimeslot: (dayIndex: number) => void
  handleRemoveTimeslot: (dayIndex: number, slotIndex: number) => void
  handleToggleDayChange: (index: number, checked: boolean) => void
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

export default function DayOfWeekCard({
  day,
  handleAddTimeslot,
  handleRemoveTimeslot,
  handleToggleDayChange,
  handleTimeslotValueChange,
}: DayOfWeekCardProps) {
  const { index, name, active, slots } = day

  return (
    <div
      key={index}
      className={clsx(
        "flex items-center border border-stone-800 gap-4 p-4 rounded",
        {
          "opacity-30": !active,
        }
      )}
    >
      <Switch
        checked={active}
        onCheckedChange={(checked) => handleToggleDayChange(index, checked)}
        className="flex-1 max-w-[36px]"
      />
      <span className="flex-1 font-semibold text-base">{name}s</span>
      <div
        className={clsx("flex flex-col items-center gap-4", {
          "pointer-events-none": !active,
        })}
      >
        {slots.map((slot, i) => (
          <TimeslotTimePicker
            key={index + "slot" + i}
            dayIndex={index}
            slot={slot}
            slotIndex={i}
            active={active}
            handleRemoveTimeslot={handleRemoveTimeslot}
            handleTimeslotValueChange={handleTimeslotValueChange}
          />
        ))}
      </div>
      <IoAdd
        onClick={() => handleAddTimeslot(index)}
        className={clsx("text-2xl cursor-pointer hover:text-primary", {
          "self-baseline mt-2": slots.length > 1,
        })}
      />
    </div>
  )
}
