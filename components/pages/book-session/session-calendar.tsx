"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeslot } from "@/lib/types/timeslot.type"
import { getSlotDate, getTimeslotMatcher } from "@/lib/utils"
import TimeslotCardList from "./timeslot-card-list"

export default function SessionCalendar({
  timeslots,
  handleConfirmTimeslot,
  selectedTimeslot,
}: {
  timeslots: Timeslot[]
  handleConfirmTimeslot: (timeslot: Timeslot) => void
  selectedTimeslot?: Timeslot
}) {
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedTimeslot ? new Date(selectedTimeslot.date) : undefined
  )
  const [selectedDateAvailableSlots, setSelectedDateAvailableSlots] = useState<
    Timeslot[]
  >(selectedTimeslot ? getTimeslotsByDate(getSlotDate(selectedTimeslot)) : [])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const timeslots = getTimeslotsByDate(date)

      if (timeslots.length) {
        setSelectedDateAvailableSlots(timeslots)
      }
    } else {
      setSelectedDateAvailableSlots([])
    }

    setSelectedDate(date)
  }

  function getTimeslotsByDate(date: Date): Timeslot[] {
    date.setHours(0, 0, 0, 0)
    const selectedDateTimestamp = date.getTime()
    const dayTimeslots = timeslots.filter(
      (slot) => slot.date === selectedDateTimestamp
    )
    return dayTimeslots || []
  }

  const handleSlotSelect = (slot: Timeslot) => {
    setSelectedSlot(slot)
  }

  return (
    <Card className="flex-1 glass text-white max-w-fit fade-in-bottom">
      <CardHeader>
        <CardTitle>Select Date and Time</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-8 items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={getTimeslotMatcher(timeslots)}
            className="calendar rounded-md p-0 mb-4 mx-auto"
          />
          <TimeslotCardList
            selectedTimeslot={selectedSlot}
            timeslots={selectedDateAvailableSlots}
            handleSlotSelect={handleSlotSelect}
            handleConfirmTimeslot={handleConfirmTimeslot}
          />
        </div>
      </CardContent>
    </Card>
  )
}
