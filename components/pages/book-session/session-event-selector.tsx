"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { BookOpen } from "lucide-react"
import MeetingEventList from "./meeting-event-list"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"
import { Address } from "viem"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Skeleton } from "@/components/ui/skeleton"

export default function SessionEventSelector({
  mentorAddress,
  selectedMeetingEvent,
  handleSelectEvent,
}: {
  mentorAddress: Address
  selectedMeetingEvent: MeetingEvent | null
  handleSelectEvent: (meetingEvent: MeetingEvent) => void
}) {
  const meetingEventsQuery = useMeetingEventsQuery(mentorAddress)

  return (
    <Card className="glass border-stone-800 text-white w-full fade-in-bottom">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-2xl">Plan your mentoring session</h3>
        </div>
        <p className="text-dim text-base">
          Choose the topic and duration for your upcoming meeting
        </p>
      </CardHeader>
      <CardContent>
        {matchQueryStatus(meetingEventsQuery, {
          Loading: (
            <div className="flex gap-2">
              <MeetingEventSkeleton />
              <MeetingEventSkeleton />
            </div>
          ),
          Errored: <p>Something wrong happened</p>,
          Empty: <p>Something wrong happened</p>,
          Success: ({ data: meetingEvents }) => (
            <>
              <MeetingEventList
                meetingEvents={meetingEvents}
                selectedMeetingEvent={selectedMeetingEvent}
                handleSelectEvent={handleSelectEvent}
              />
            </>
          ),
        })}
      </CardContent>
    </Card>
  )
}

function MeetingEventSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-[200px] glass p-4 z-[1] text-white border-transparent border-2 rounded-md">
      <div className="flex gap-4">
        <Skeleton className="h-2 w-full flex-3 bg-dim bg-opacity-15" />
        <Skeleton className="h-2 w-full flex-1 bg-dim bg-opacity-15" />
      </div>
      <Skeleton className="h-2 w-full bg-dim bg-opacity-15" />
    </div>
  )
}
