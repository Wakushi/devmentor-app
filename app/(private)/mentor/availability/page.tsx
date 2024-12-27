"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { Mentor } from "@/lib/types/user.type"
import { DayOfWeek, MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { useEffect, useState } from "react"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"
import { updateMeetingEvent, updateUserTimezone } from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { toast } from "@/hooks/use-toast"
import { FaCircleCheck } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import { useQueryClient } from "@tanstack/react-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { MeetingEvents } from "@/components/pages/dashboard/mentor/meeting-events"
import { DAYS_OF_WEEK } from "@/lib/constants"
import { getDefaultSlot, getWeekdayName } from "@/lib/utils"
import useUserTimezoneQuery from "@/hooks/queries/user-timezone-query"
import CopyMeetingHourSelector from "@/components/timeslot-selection/copy-meeting-hour-selector"
import TimezoneSelector from "@/components/timeslot-selection/timezone-selector"

export default function AvailabilityPage() {
  const queryClient = useQueryClient()

  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  const meetingEventsQuery = useMeetingEventsQuery(user?.account)
  const userTimezoneQuery = useUserTimezoneQuery(user?.account)

  const { data: meetingEvents, isLoading: loadingEvents } = meetingEventsQuery
  const { data: timezone } = userTimezoneQuery

  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null)
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([])

  useEffect(() => {
    if (!meetingEvents || !meetingEvents.length) return

    if (!selectedEvent) {
      setSelectedEvent(meetingEvents[0])
    }

    const displayedEvent = selectedEvent ? selectedEvent : meetingEvents[0]
    setDaysOfWeek(getInitialDaysOfWeek(displayedEvent))
  }, [meetingEvents])

  useEffect(() => {
    if (!user) return

    queryClient.refetchQueries({ queryKey: [QueryKeys.TIMEZONE] })
  }, [user])

  function handleSelectEvent(meetingEvent: MeetingEvent | null): void {
    setSelectedEvent(meetingEvent)
    setDaysOfWeek(getInitialDaysOfWeek(meetingEvent))
  }

  function handleCopyEventTimeslots(meetingEventId: string): void {
    if (!meetingEvents || !selectedEvent) return

    const targetMeetingEvent = meetingEvents.find(
      (event) => event.id === meetingEventId
    )

    if (!targetMeetingEvent) {
      toast({
        title: "Error",
        description: "Failed to update meeting event. Event not found.",
        action: <MdError className="text-white" />,
      })
      return
    }

    handleSaveTimeslots(selectedEvent, targetMeetingEvent.timeslots)
  }

  async function handleSaveTimeslots(
    meetingEvent: MeetingEvent,
    timeslots: Timeslot[]
  ): Promise<void> {
    try {
      const { success, error } = await updateMeetingEvent({
        ...meetingEvent,
        timeslots,
      })

      if (success) {
        toast({
          title: "Success",
          description: "Your availabilities are up to date!",
          action: <FaCircleCheck className="text-white" />,
        })

        setSelectedEvent((prevSelectedEvent) => {
          if (!prevSelectedEvent) return null
          return {
            ...prevSelectedEvent,
            timeslots,
          }
        })

        queryClient.invalidateQueries({
          queryKey: [QueryKeys.MEETING_EVENTS],
        })
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

  function getInitialDaysOfWeek(
    meetingEvent: MeetingEvent | null
  ): DayOfWeek[] {
    const baseDays = Array.from({ length: DAYS_OF_WEEK }, (_, i) => ({
      index: i,
      name: getWeekdayName(i),
      slots: [],
      active: false,
    }))

    if (meetingEvent?.timeslots && meetingEvent.timeslots.length) {
      return computeDaysOfWeek(baseDays, meetingEvent.timeslots)
    }

    return baseDays.map((day) => ({
      ...day,
      slots: [getDefaultSlot()],
      active: false,
    }))
  }

  async function handleSelectTimezone(timezone: string): Promise<void> {
    toast({
      title: "Timezone updated",
      description: "Timezone set to " + timezone,
      action: <FaCircleCheck className="text-white" />,
    })

    await updateUserTimezone(timezone)

    queryClient.refetchQueries({ queryKey: [QueryKeys.TIMEZONE] })
  }

  if (loadingUser || loadingEvents) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-[8rem] pb-8 min-h-screen m-auto w-[95%]">
      <div className="flex gap-8 w-full">
        {matchQueryStatus(meetingEventsQuery, {
          Loading: <LoadingScreen />,
          Errored: <p>Something wrong happened</p>,
          Success: ({ data: meetingEvents }) => {
            return (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-2xl">Events</h2>
                    <p className="text-small font-normal font-sans text-dim">
                      Manage your events
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-small font-normal font-sans text-dim">
                      Timezone
                    </p>
                    <TimezoneSelector
                      timezone={timezone}
                      handleSelectTimezone={handleSelectTimezone}
                    />
                  </div>
                </div>
                <MeetingEvents
                  mentor={user}
                  meetingEvents={meetingEvents}
                  selectedEvent={selectedEvent}
                  handleSelectEvent={handleSelectEvent}
                />
              </div>
            )
          },
        })}

        {!!selectedEvent && meetingEvents && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <h2 className="text-2xl">{selectedEvent.name}</h2>
              <p className="text-small font-normal font-sans text-dim">
                Update your availabilities for the {selectedEvent.name} event
              </p>
            </div>
            {meetingEvents.length > 1 && (
              <CopyMeetingHourSelector
                selectedEvent={selectedEvent}
                meetingEvents={meetingEvents}
                handleCopyEventTimeslots={handleCopyEventTimeslots}
              />
            )}
            <AvailabilityPicker
              mentor={user}
              selectedEvent={selectedEvent}
              daysOfWeek={daysOfWeek}
              setDaysOfWeek={setDaysOfWeek}
              handleSaveTimeslots={handleSaveTimeslots}
            />
          </div>
        )}
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
