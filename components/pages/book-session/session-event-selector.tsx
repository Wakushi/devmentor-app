import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { BookOpen } from "lucide-react"
import MeetingEventList from "./meeting-event-list"

export default function SessionEventSelector({
  meetingEvents,
  selectedMeetingEvent,
  handleSelectEvent,
}: {
  meetingEvents: MeetingEvent[]
  selectedMeetingEvent: MeetingEvent | null
  handleSelectEvent: (meetingEvent: MeetingEvent) => void
}) {
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
        <MeetingEventList
          meetingEvents={meetingEvents}
          selectedMeetingEvent={selectedMeetingEvent}
          handleSelectEvent={handleSelectEvent}
        />
      </CardContent>
    </Card>
  )
}
