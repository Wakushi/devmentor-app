"use client"

import { DayOfWeek, DaySlot, Timeslot } from "@/lib/types/timeslot.type"
import { getWeekdayName } from "@/lib/utils"
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
import { Address } from "viem"

export default function AvailabilityPicker({
  mentor,
  timeslots,
  handleSaveAvailabilities,
}: {
  mentor: Mentor
  timeslots: Timeslot[]
  handleSaveAvailabilities: (availabilities: Timeslot[]) => void
}) {
  const DEFAULT_SLOT: DaySlot = {
    timeStart: NINE_THIRTY_AM,
    timeEnd: FIVE_PM,
  }

  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(initialDaysOfWeek())

  function initialDaysOfWeek(): DayOfWeek[] {
    const baseDays = Array.from({ length: DAYS_OF_WEEK }, (_, i) => ({
      index: i,
      name: getWeekdayName(i),
      slots: [],
      active: false,
    }))

    if (timeslots && timeslots.length) {
      return computeDaysOfWeek(baseDays, timeslots)
    }

    return baseDays.map((day, i) => ({
      ...day,
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

  async function onSubmit(): Promise<void> {
    const availabilityRanges = computeAvailabilityRange(
      daysOfWeek,
      mentor.account
    )

    if (!availabilityRanges.length) return

    handleSaveAvailabilities(availabilityRanges)
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
            mentorAddress,
            day: index,
            timeStart,
            timeEnd,
            events: [],
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
      slots: day.active ? day.slots : [DEFAULT_SLOT],
    }))
  }

  return (
    <section className="max-w-[500px] max-h-[500px] overflow-y-auto flex flex-col gap-4 p-4 rounded">
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
      <Button onClick={onSubmit}>Confirm</Button>
    </section>
  )
}
