"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { getTimeslotMatcher, getTimeZone } from "@/lib/utils"
import TimeslotCardList from "./timeslot-card-list"
import { CalendarDays } from "lucide-react"
import useSessionsQuery from "@/hooks/queries/sessions-query"
import { Mentor } from "@/lib/types/user.type"
import { Session } from "@/lib/types/session.type"
import CalendarSkeleton from "@/components/ui/calendar-skeleton"
import TimezoneSelector from "@/components/timeslot-selection/timezone-selector"
import { toast } from "@/hooks/use-toast"
import { FaCircleCheck } from "react-icons/fa6"
import { updateUserTimezone } from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient()

  const { data: sessions, isLoading: loadingSessions } =
    useSessionsQuery(mentor)

  const [selectedSlot, setSelectedSlot] = useState<number | undefined>()

  const [selectedDateAvailableSlots, setSelectedDateAvailableSlots] = useState<
    number[]
  >(selectedDate ? computeDividedSlots(selectedDate) : [])

  const [timezone, setTimezone] = useState<string>(getTimeZone().value)

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

  async function handleSelectTimezone(timezone: string): Promise<void> {
    toast({
      title: "Timezone updated",
      description: "Timezone set to " + timezone,
      action: <FaCircleCheck className="text-white" />,
    })

    setTimezone(timezone)

    await updateUserTimezone(timezone)

    queryClient.refetchQueries({ queryKey: [QueryKeys.TIMEZONE] })
  }

  if (!selectedMeetingEvent) return null

  return (
    <Card className="glass border-stone-800 text-white w-full fade-in-bottom">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <h3 className="text-2xl">Schedule your session</h3>
            </div>
            <p className="text-dim text-base">
              Choose the right time to grow your skills!
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-small font-normal font-sans text-dim">
              Select your timezone
            </p>
            <TimezoneSelector
              timezone={timezone}
              handleSelectTimezone={handleSelectTimezone}
            />
          </div>
        </div>
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
