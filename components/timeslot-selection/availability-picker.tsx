"use client"

import {
  DayOfWeek,
  DaySlot,
  MeetingEvent,
  Timeslot,
} from "@/lib/types/timeslot.type"
import { getWeekdayName } from "@/lib/utils"
import { useEffect, useState } from "react"
import { TimeValue } from "react-aria"
import DayOfWeekCard from "./day-of-week-card"
import { Button } from "../ui/button"
import { Mentor } from "@/lib/types/user.type"
import { DAYS_OF_WEEK } from "@/lib/constants"
import { Address } from "viem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RiEditLine } from "react-icons/ri"

export default function AvailabilityPicker({
  mentor,
  selectedEvent,
  handleSaveTimeslots,
}: {
  mentor: Mentor
  selectedEvent: MeetingEvent
  handleSaveTimeslots: (
    meetingEvent: MeetingEvent,
    timeslots: Timeslot[]
  ) => Promise<void>
}) {
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)

  useEffect(() => {
    function initialDaysOfWeek(): DayOfWeek[] {
      const baseDays = Array.from({ length: DAYS_OF_WEEK }, (_, i) => ({
        index: i,
        name: getWeekdayName(i),
        slots: [],
        active: false,
      }))

      if (selectedEvent.timeslots && selectedEvent.timeslots.length) {
        return computeDaysOfWeek(baseDays, selectedEvent.timeslots)
      }

      return baseDays.map((day) => ({
        ...day,
        slots: [getDefaultSlot()],
        active: false,
      }))
    }

    setDaysOfWeek(initialDaysOfWeek())
    setHasUnsavedChanges(false)
  }, [selectedEvent])

  function timeValueToTimestamp(timeValue: TimeValue): number {
    if (!timeValue) return 0

    const { hour, minute } = timeValue
    const date = new Date()

    date.setHours(hour)
    date.setMinutes(minute)

    return date.getTime()
  }

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

    if (!availabilityRanges.length) return

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

  function computeDaysOfWeek(
    baseDays: DayOfWeek[],
    timeslots: Timeslot[]
  ): DayOfWeek[] {
    timeslots.forEach(({ timeStart, timeEnd, day }) => {
      baseDays[day].active = true
      baseDays[day].slots.push({
        timeStart,
        timeEnd,
      })
    })

    return baseDays.map((day) => ({
      ...day,
      slots: day.active ? day.slots : [getDefaultSlot()],
    }))
  }

  function getDefaultSlot(): DaySlot {
    const date = new Date()
    date.setMinutes(0)

    date.setHours(9)
    const timeStart = date.getTime()

    date.setHours(17)
    const timeEnd = date.getTime()

    const defaultSlot: DaySlot = {
      timeStart,
      timeEnd,
    }

    return defaultSlot
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
