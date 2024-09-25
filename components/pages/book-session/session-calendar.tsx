"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMockTimeslots } from "@/lib/mock/utils"
import { Timeslot } from "@/lib/types/timeslot.type"
import { getTimeslotMatcher } from "@/lib/utils"
import TimeslotCardList from "./timeslot-card-list"

export default function SessionCalendar() {
  const [timeslots, setTimeslots] = useState<Timeslot[]>(
    generateMockTimeslots(new Date("2024-09-25"), 1)
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedDateAvailableSlots, setSelectedDateAvailableSlots] = useState<
    Timeslot[]
  >([])
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | undefined>()
  const mockAvailableTimeslots = timeslots.filter((slot) => !slot.isBooked)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(0, 0, 0, 0)
      const selectedDateTimestamp = date.getTime()
      const timeslots = mockAvailableTimeslots.filter(
        (slot) => slot.date === selectedDateTimestamp
      )

      if (timeslots.length) {
        setSelectedDateAvailableSlots(timeslots)
      }
    } else {
      setSelectedDateAvailableSlots([])
    }

    setSelectedDate(date)
  }

  const handleSlotSelect = (slot: Timeslot) => {
    setSelectedSlot(slot)
  }

  const handleBooking = () => {
    if (selectedDate && selectedSlot) {
      console.log(
        `Booking for ${selectedDate.toDateString()} at ${selectedSlot}`
      )
    }
  }

  return (
    <Card className="flex-1 glass text-white max-w-fit">
      <CardHeader>
        <CardTitle>Select Date and Time</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-8 items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={getTimeslotMatcher(mockAvailableTimeslots)}
            className="calendar rounded-md p-0 mb-4 mx-auto"
          />
          <TimeslotCardList
            selectedTimeslot={selectedSlot}
            timeslots={selectedDateAvailableSlots}
            handleSlotSelect={handleSlotSelect}
          />
        </div>
      </CardContent>
    </Card>
  )
}
