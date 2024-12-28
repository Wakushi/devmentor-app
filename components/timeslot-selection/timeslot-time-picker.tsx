"use client"
import { DaySlot } from "@/lib/types/timeslot.type"
import { TimeValue } from "react-aria"
import { TimePicker } from "../ui/time-picker"
import { IoRemove } from "react-icons/io5"
import { timeStampToTimeValue } from "@/lib/utils"
import { getTimeZoneByValue, Timezone } from "@/lib/timezones"
import useUserTimezoneQuery from "@/hooks/queries/user-timezone-query"
import { useUser } from "@/stores/user.store"
import { Mentor } from "@/lib/types/user.type"
import { Skeleton } from "../ui/skeleton"

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

  const { user } = useUser() as {
    user: Mentor
  }
  const { data: timeZoneValue, isLoading: loadingTimeZone } =
    useUserTimezoneQuery(user?.account)

  if (loadingTimeZone) {
    return (
      <div className="flex w-full items-center gap-1 glass rounded-md px-4 py-2">
        <Skeleton className="h-4 w-[75px] bg-dim bg-opacity-15" />
        -
        <Skeleton className="h-4 w-[75px] bg-dim bg-opacity-15" />
      </div>
    )
  }

  const timeZone = timeZoneValue
    ? getTimeZoneByValue(timeZoneValue).label
    : undefined

  return (
    <div className="relative">
      <div className="flex items-center gap-1 glass rounded-md px-4 py-2">
        <TimePicker
          value={timeStampToTimeValue(slot.timeStart, timeZone)}
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
          value={timeStampToTimeValue(slot.timeEnd, timeZone)}
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
