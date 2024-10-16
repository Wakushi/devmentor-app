"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { getTimeslotMatcher } from "@/lib/utils"
import TimeslotCardList from "./timeslot-card-list"
import { CalendarDays } from "lucide-react"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { Mentor } from "@/lib/types/user.type"
import { Session } from "@/lib/types/session.type"
import CalendarSkeleton from "@/components/ui/calendar-skeleton"

export default function SessionCalendar({
  mentor,
  handleConfirmTimeslot,
  selectedMeetingEvent,
  selectedDate,
  handleSelectDate,
}: {
  mentor: Mentor
  handleConfirmTimeslot: (slot: number) => void
  selectedMeetingEvent: MeetingEvent | null
  selectedDate: Date | undefined
  handleSelectDate: (date: Date | undefined) => void
}) {
  const { data: sessions, isLoading: loadingSessions } =
    useSessionsQuery(mentor)

  const [selectedSlot, setSelectedSlot] = useState<number | undefined>()

  const [selectedDateAvailableSlots, setSelectedDateAvailableSlots] = useState<
    number[]
  >(selectedDate ? computeDividedSlots(selectedDate) : [])

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      if (selectedMeetingEvent) {
        const timeDividedSlots = computeDividedSlots(date)
        setSelectedDateAvailableSlots(timeDividedSlots)
      }
    } else {
      setSelectedDateAvailableSlots([])
    }

    handleSelectDate(date)
  }

  function computeDividedSlots(date: Date): number[] {
    if (!selectedMeetingEvent) return []

    const timeDividedSlots: number[] = []
    const timeslots = getTimeslotsByDate(date)
    const eventDurationInMs = selectedMeetingEvent.duration

    let bookedSessions: Session[] = []

    const selectedDay = new Date(date)
    selectedDay.setHours(0, 0, 0, 0)

    if (sessions) {
      bookedSessions = sessions.filter((session) => {
        const sessionDay = new Date(session.startTime)
        sessionDay.setHours(0, 0, 0, 0)

        const sameDay = selectedDay.getTime() === sessionDay.getTime()
        return sameDay && session.accepted && session.endTime > Date.now()
      })
    }

    timeslots.forEach(({ timeStart, timeEnd }) => {
      let sessionStartTime = timeStart

      while (sessionStartTime < timeEnd - eventDurationInMs) {
        sessionStartTime += eventDurationInMs

        const sessionStart = new Date(sessionStartTime)
        const sessionStartHour = sessionStart.getHours()
        const sessionStartMinutes = sessionStart.getMinutes()

        if (
          !bookedSessions.some((session) => {
            const bookedStartTime = new Date(session.startTime)
            const bookedStartHour = bookedStartTime.getHours()
            const bookedStartMinutes = bookedStartTime.getMinutes()

            const bookedEndTime = new Date(session.endTime)
            const bookedEndHour = bookedEndTime.getHours()

            const startsAfter = (): boolean => {
              if (sessionStartHour === bookedStartHour) {
                return (
                  bookedStartMinutes <= sessionStartMinutes ||
                  bookedStartMinutes < eventDurationInMs / 60 / 1000
                )
              }

              return sessionStartHour >= bookedStartHour
            }

            const endsBefore = sessionStartHour < bookedEndHour

            return startsAfter() && endsBefore
          })
        ) {
          timeDividedSlots.push(sessionStartTime)
        }
      }
    })

    return timeDividedSlots
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

  if (!selectedMeetingEvent) return null

  return (
    <Card className="glass border-stone-800 text-white w-full fade-in-bottom">
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
        {loadingSessions ? (
          <div className="flex justify-center items-center">
            <CalendarSkeleton />
          </div>
        ) : (
          <div className="flex gap-8 items-center">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
