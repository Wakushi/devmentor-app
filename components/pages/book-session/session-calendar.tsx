"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { getTimeslotMatcher } from "@/lib/utils"
import TimeslotCardList from "./timeslot-card-list"
import { CalendarDays } from "lucide-react"
import MeetingEventList from "./meeting-event-list"

export default function SessionCalendar({
  meetingEvents,
  handleConfirmTimeslot,
  selectedMeetingEvent,
  handleConfirmMeetingEvent,
  selectedDate,
  handleSelectDate,
}: {
  meetingEvents: MeetingEvent[]
  handleConfirmTimeslot: (slot: number) => void
  selectedMeetingEvent: MeetingEvent | null
  handleConfirmMeetingEvent: (meetingEvent: MeetingEvent) => void
  selectedDate: Date
  handleSelectDate: (date: Date) => void
}) {
  const [selectedSlot, setSelectedSlot] = useState<number | undefined>()
  const [selectedDateAvailableSlots, setSelectedDateAvailableSlots] = useState<
    number[]
  >([])

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      if (selectedMeetingEvent) {
        const timeslots = getTimeslotsByDate(date)
        const timeDividedSlots: number[] = []
        const eventDurationInMs = selectedMeetingEvent.duration

        timeslots.forEach(({ timeStart, timeEnd }) => {
          let sessionStartTime = timeStart

          while (sessionStartTime < timeEnd - eventDurationInMs) {
            sessionStartTime += eventDurationInMs

            timeDividedSlots.push(sessionStartTime)
          }
        })

        handleSelectDate(date)
        setSelectedDateAvailableSlots(timeDividedSlots)
      }
    } else {
      setSelectedDateAvailableSlots([])
    }
  }

  function getTimeslotsByDate(date: Date): Timeslot[] {
    if (!selectedMeetingEvent) return []

    return selectedMeetingEvent.timeslots.filter(
      (timeslot) => timeslot.day === date.getDay()
    )
  }

  function handleSlotSelect(slot: number) {
    setSelectedSlot(slot)
  }

  function handleSelectEvent(meetingEvent: MeetingEvent): void {
    handleConfirmMeetingEvent(meetingEvent)
  }

  return (
    <Card className="glass border-stone-800 text-white max-w-fit fade-in-bottom">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <h3 className="text-2xl">Schedule your session</h3>
        </div>
        <p className="text-dim text-base">
          Choose a time to tap into your mentor's expertise and grow your
          skills!
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-8 items-center">
          <MeetingEventList
            meetingEvents={meetingEvents}
            selectedMeetingEvent={selectedMeetingEvent}
            handleSelectEvent={handleSelectEvent}
          />

          {!!selectedMeetingEvent && (
            <>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={getTimeslotMatcher(selectedMeetingEvent?.timeslots)}
                className="calendar rounded-md p-0 mb-4 mx-auto"
              />
              <TimeslotCardList
                selectedSlot={selectedSlot}
                dividedSlots={selectedDateAvailableSlots}
                handleSlotSelect={handleSlotSelect}
                handleConfirmTimeslot={handleConfirmTimeslot}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
