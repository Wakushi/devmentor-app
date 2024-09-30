"use client"

import { DayOfWeek, DaySlot } from "@/lib/types/timeslot.type"
import { computeTimeslots, getWeekdayName } from "@/lib/utils"
import { useState } from "react"
import { TimeValue } from "react-aria"
import DayOfWeekCard from "./day-of-week-card"
import { Button } from "../ui/button"
import { Mentor } from "@/lib/types/user.type"
import {
  DAYS_OF_WEEK,
  FIVE_PM,
  NINE_THIRTY_AM,
  SATURDAY,
  SUNDAY,
} from "@/lib/constants"
import { pinMentorTimeslots } from "@/lib/actions/client/pinata-actions"

export default function AvailabilityPicker({ mentor }: { mentor: Mentor }) {
  const DEFAULT_SLOT: DaySlot = {
    timeStart: NINE_THIRTY_AM,
    timeEnd: FIVE_PM,
  }

  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(initialDaysOfWeek())

  function initialDaysOfWeek(): DayOfWeek[] {
    return Array.from({ length: DAYS_OF_WEEK }, (_, i) => ({
      index: i,
      name: getWeekdayName(i),
      slots: [DEFAULT_SLOT],
      active: i > SUNDAY && i < SATURDAY,
    }))
  }

  function timeValueToTimestamp(timeValue: TimeValue): number {
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
  }

  function handleToggleDayChange(index: number, checked: boolean): void {
    setDaysOfWeek((prevDays: DayOfWeek[]) =>
      prevDays.map((day) =>
        day.index === index ? { ...day, active: checked } : day
      )
    )
  }

  function handleAddTimeslot(dayIndex: number): void {
    setDaysOfWeek((prevDaysOfWeek) =>
      prevDaysOfWeek.map((day) =>
        day.index === dayIndex
          ? { ...day, slots: [...day.slots, DEFAULT_SLOT] }
          : day
      )
    )
  }

  function handleRemoveTimeslot(dayIndex: number, slotIndex: number) {
    setDaysOfWeek((prevDaysOfWeek) =>
      prevDaysOfWeek.map((day) =>
        day.index === dayIndex
          ? { ...day, slots: day.slots.filter((_, i) => i !== slotIndex) }
          : day
      )
    )
  }

  async function handleSaveTimeslots(): Promise<void> {
    const timeslots = computeTimeslots(daysOfWeek, mentor.address)
    const updatedMentor = await pinMentorTimeslots(mentor, timeslots)
    console.log("updatedMentor: ", updatedMentor)
  }

  return (
    <section className="max-w-[500px] glass flex flex-col gap-4 p-4 rounded">
      <div className="flex flex-col gap-4">
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
      <Button onClick={handleSaveTimeslots}>Confirm</Button>
    </section>
  )
}
