"use client"

import { DayOfWeek, MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { getDefaultSlot, timeValueToTimestamp } from "@/lib/utils"
import { Dispatch, SetStateAction, useState } from "react"
import { TimeValue } from "react-aria"
import DayOfWeekCard from "./day-of-week-card"
import { Button } from "../ui/button"
import { Mentor } from "@/lib/types/user.type"
import { Address } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RiEditLine } from "react-icons/ri"
import { toast } from "@/hooks/use-toast"
import { MdError } from "react-icons/md"

interface AvailabilityPickerProps {
  mentor: Mentor
  selectedEvent: MeetingEvent
  daysOfWeek: DayOfWeek[]
  setDaysOfWeek: Dispatch<SetStateAction<DayOfWeek[]>>
  handleSaveTimeslots: (
    meetingEvent: MeetingEvent,
    timeslots: Timeslot[]
  ) => Promise<void>
}

export default function AvailabilityPicker({
  mentor,
  selectedEvent,
  daysOfWeek,
  setDaysOfWeek,
  handleSaveTimeslots,
}: AvailabilityPickerProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)

  function handleTimeslotValueChange({
    dayIndex,
    slotIndex,
    type,
    value,
  }: {
    dayIndex: number
    slotIndex: number
    type: "timeStart" | "timeEnd"
    value: TimeValue
  }): void {
    setDaysOfWeek((prevDaysOfWeek) =>
      prevDaysOfWeek.map((day) =>
        day.index === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, i) =>
                i === slotIndex
                  ? { ...slot, [type]: timeValueToTimestamp(value) }
                  : slot
              ),
            }
          : day
      )
    )

    setHasUnsavedChanges(true)
  }

  function handleToggleDayChange(index: number, checked: boolean): void {
    setDaysOfWeek((prevDays: DayOfWeek[]) =>
      prevDays.map((day) =>
        day.index === index ? { ...day, active: checked } : day
      )
    )
    setHasUnsavedChanges(true)
  }

  function handleAddTimeslot(dayIndex: number): void {
    setDaysOfWeek((prevDaysOfWeek) =>
      prevDaysOfWeek.map((day) =>
        day.index === dayIndex
          ? { ...day, slots: [...day.slots, getDefaultSlot()] }
          : day
      )
    )
    setHasUnsavedChanges(true)
  }

  function handleRemoveTimeslot(dayIndex: number, slotIndex: number) {
    setDaysOfWeek((prevDaysOfWeek) =>
      prevDaysOfWeek.map((day) =>
        day.index === dayIndex
          ? { ...day, slots: day.slots.filter((_, i) => i !== slotIndex) }
          : day
      )
    )
    setHasUnsavedChanges(true)
  }

  async function onSubmit(): Promise<void> {
    const availabilityRanges = computeAvailabilityRange(
      daysOfWeek,
      mentor.account
    )

    if (!availabilityRanges.length) {
      toast({
        title: "Error",
        description: "Please select at least one time slot for this event.",
        action: <MdError className="text-white" />,
      })
      return
    }

    await handleSaveTimeslots(selectedEvent, availabilityRanges)

    setHasUnsavedChanges(false)
  }

  function computeAvailabilityRange(
    days: DayOfWeek[],
    mentorAddress: Address
  ): Timeslot[] {
    if (!days || !days.length || !mentorAddress) return []

    const availabilities: Timeslot[] = []

    days
      .filter((d) => d.active && d.slots.length)
      .forEach(({ slots, index }) => {
        slots.forEach(({ timeStart, timeEnd }) => {
          availabilities.push({
            day: index,
            timeStart,
            timeEnd,
          })
        })
      })

    return availabilities
  }

  return (
    <section className="max-w-[500px] min-h-[300px] glass p-4 flex flex-col justify-center items-center gap-4 rounded">
      {hasUnsavedChanges && (
        <Alert className="bg-yellow-100 w-full">
          <AlertDescription className="flex items-center gap-2">
            <RiEditLine className="text-yellow-500" />
            <span>You have unsaved changes</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2 w-full">
        {daysOfWeek.map((day: DayOfWeek) => {
          return (
            <DayOfWeekCard
              key={day.name}
              day={day}
              handleAddTimeslot={handleAddTimeslot}
              handleRemoveTimeslot={handleRemoveTimeslot}
              handleToggleDayChange={handleToggleDayChange}
              handleTimeslotValueChange={handleTimeslotValueChange}
            />
          )
        })}
      </div>
      <Button onClick={onSubmit} disabled={!hasUnsavedChanges}>
        {hasUnsavedChanges ? "Save Changes" : "No Changes to Save"}
      </Button>
    </section>
  )
}
