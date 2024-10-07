"use client"

import { DayOfWeek, DaySlot, Timeslot } from "@/lib/types/timeslot.type"
import { getWeekdayName } from "@/lib/utils"
import { useEffect, useState } from "react"
import { TimeValue } from "react-aria"
import DayOfWeekCard from "./day-of-week-card"
import { Button } from "../ui/button"
import { Mentor } from "@/lib/types/user.type"
import { DAYS_OF_WEEK, FIVE_PM, NINE_THIRTY_AM } from "@/lib/constants"
import { Address } from "viem"
import { updateTimeslots } from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { toast } from "@/hooks/use-toast"
import { FaCircleCheck } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import { useQueryClient } from "@tanstack/react-query"
import useTimeslotsQuery from "@/hooks/queries/timeslots-query"
import Loader from "../ui/loader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RiEditLine, RiCheckLine } from "react-icons/ri"

const DEFAULT_SLOT: DaySlot = {
  timeStart: NINE_THIRTY_AM,
  timeEnd: FIVE_PM,
}

export default function AvailabilityPicker({ mentor }: { mentor: Mentor }) {
  const queryClient = useQueryClient()

  const timeslotsQuery = useTimeslotsQuery(mentor.account)
  const { data: timeslots, isLoading: loadingTimeslots } = timeslotsQuery

  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)
  const [savedChanges, setSavedChanges] = useState<boolean>(false)

  useEffect(() => {
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

      return baseDays.map((day) => ({
        ...day,
        slots: [DEFAULT_SLOT],
        active: false,
      }))
    }

    setDaysOfWeek(initialDaysOfWeek())
    setHasUnsavedChanges(false)
  }, [timeslots])

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
          ? { ...day, slots: [...day.slots, DEFAULT_SLOT] }
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

    try {
      const { success, error } = await updateTimeslots(availabilityRanges)

      if (success) {
        toast({
          title: "Success",
          description: "Your availabilities are up to date!",
          action: <FaCircleCheck className="text-white" />,
        })

        queryClient.invalidateQueries({
          queryKey: [QueryKeys.TIMESLOTS, mentor.account],
        })

        setSavedChanges(true)
        setHasUnsavedChanges(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Failed to update timeslots:", error)

      toast({
        title: "Error",
        description: "Failed to update availabilities. Please try again.",
        action: <MdError className="text-white" />,
      })
    }
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
    <section className="max-w-[500px] min-h-[300px] glass p-4 flex flex-col justify-center items-center gap-4 rounded">
      {loadingTimeslots ? (
        <Loader />
      ) : (
        <>
          {hasUnsavedChanges && (
            <Alert className="bg-yellow-100 w-full">
              <AlertDescription className="flex items-center gap-2">
                <RiEditLine className="text-yellow-500" />
                <span>You have unsaved changes</span>
              </AlertDescription>
            </Alert>
          )}

          {savedChanges && (
            <Alert className="bg-green-100 w-full">
              <AlertDescription className="flex items-center gap-2">
                <RiCheckLine className="text-green-500" />
                <span>Your availabilities are up to date !</span>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4 w-full">
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
        </>
      )}
    </section>
  )
}
