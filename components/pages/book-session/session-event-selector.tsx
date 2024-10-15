"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { BookOpen, Clock } from "lucide-react"
import MeetingEventList from "./meeting-event-list"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"
import { Address } from "viem"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import NavLinkButton from "@/components/ui/nav-link"
import { FaLongArrowAltLeft } from "react-icons/fa"
import clsx from "clsx"

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

  function createCustomMeetingEvent(): MeetingEvent {
    const createTime = (hours: number, minutes: number): number => {
      const date = new Date(2024, 0, 1, hours, minutes)
      return date.getTime()
    }

    const createAllTimeslots = (): Timeslot[] => {
      const timeslots: Timeslot[] = []
      for (let day = 0; day < 7; day++) {
        timeslots.push({
          day,
          timeStart: createTime(0, 0),
          timeEnd: createTime(23, 59),
        })
      }
      return timeslots
    }

    const customMeetingEvent: MeetingEvent = {
      mentorAddress,
      name: "Custom meeting event",
      duration: 60 * 60 * 1000,
      timeslots: createAllTimeslots(),
    }

    return customMeetingEvent
  }

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
          Empty: (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col text-base text-dim">
                <p>This mentor hasn't set up any specific meeting times.</p>
                <p>You can still propose a custom time for your session.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[36px] text-small">
                  <NavLinkButton
                    variant="filled-secondary"
                    text="small"
                    href="/student/mentor-search"
                  >
                    <FaLongArrowAltLeft />
                    Back to list
                  </NavLinkButton>
                </div>
                <Button
                  className={clsx({
                    "bg-slate-400 border-slate-500 hover:border-primary":
                      !!!selectedMeetingEvent,
                  })}
                  onClick={() => {
                    const customMeetingEvent = createCustomMeetingEvent()
                    handleSelectEvent(customMeetingEvent)
                  }}
                >
                  <Clock className="w-4 h-4" />
                  Choose Custom Time
                </Button>
              </div>
            </div>
          ),
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
