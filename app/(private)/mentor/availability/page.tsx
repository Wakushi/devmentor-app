"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { Mentor } from "@/lib/types/user.type"
import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"
import { Label } from "@/components/ui/label"
import { updateMeetingEvent } from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { toast } from "@/hooks/use-toast"
import { FaCircleCheck } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import { useQueryClient } from "@tanstack/react-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import Loader from "@/components/ui/loader"
import { MeetingEvents } from "@/components/pages/dashboard/mentor/meeting-events"

export default function AvailabilityPage() {
  const queryClient = useQueryClient()

  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  const meetingEventsQuery = useMeetingEventsQuery(user?.account)
  const { data: meetingEvents } = meetingEventsQuery

  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null)

  function handleSelectEvent(meetingEvent: MeetingEvent | null): void {
    setSelectedEvent(meetingEvent)
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
          queryKey: [QueryKeys.MEETING_EVENTS, user.account],
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

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-[8rem] pb-8 min-h-screen m-auto w-[95%]">
      <div className="flex gap-8 w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <h2 className="text-2xl">Events</h2>
            <p className="text-small font-normal font-sans text-dim">
              Manage your events
            </p>
          </div>
          {matchQueryStatus(meetingEventsQuery, {
            Loading: (
              <div className="w-[300px] h-[100px] flex justify-center items-center">
                <Loader />
              </div>
            ),
            Errored: <p>Something wrong happened</p>,
            Success: ({ data }) => (
              <MeetingEvents
                mentor={user}
                meetingEvents={data}
                selectedEvent={selectedEvent}
                handleSelectEvent={handleSelectEvent}
              />
            ),
          })}
        </div>
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
              handleSaveTimeslots={handleSaveTimeslots}
            />
          </div>
        )}
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}

function CopyMeetingHourSelector({
  selectedEvent,
  meetingEvents,
  handleCopyEventTimeslots,
}: {
  selectedEvent: MeetingEvent
  meetingEvents: MeetingEvent[]
  handleCopyEventTimeslots: (meetingId: string) => void
}) {
  return (
    <div className="flex gap-2 items-center">
      <Label>Apply hours from </Label>
      <Select
        onValueChange={(meetingEventId) =>
          handleCopyEventTimeslots(meetingEventId)
        }
      >
        <SelectTrigger className="w-1/3">
          <SelectValue placeholder="Select another event to copy" />
        </SelectTrigger>
        <SelectContent>
          {meetingEvents
            .filter((event) => event.id !== selectedEvent.id)
            .map(({ name, id }) => (
              <SelectItem key={id} value={id ?? ""}>
                {name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
