import { MeetingEvent } from "@/lib/types/timeslot.type"
import { msToReadableDuration } from "@/lib/utils"
import clsx from "clsx"
import { Clock } from "lucide-react"

export default function MeetingEventList({
  meetingEvents,
  selectedMeetingEvent,
  handleSelectEvent,
}: {
  meetingEvents: MeetingEvent[]
  selectedMeetingEvent: MeetingEvent | null
  handleSelectEvent: (meetingEvents: MeetingEvent) => void
}) {
  return (
    <div className="flex flex-col self-start gap-2">
      {!!meetingEvents &&
        meetingEvents.map((meetingEvent) => (
          <div
            key={meetingEvent.id}
            onClick={() => handleSelectEvent(meetingEvent)}
            className={clsx(
              "glass max-w-[300px] px-4 py-2 z-[1] text-white border-transparent border-2 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl rounded-md ",
              {
                "border-white": selectedMeetingEvent?.id === meetingEvent.id,
                "border-b-secondary":
                  selectedMeetingEvent?.id !== meetingEvent.id,
              }
            )}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-body text-md">{meetingEvent.name}</h3>
              <span className="text-small text-dim flex items-center gap-1">
                <Clock className="w-5 h-5" />{" "}
                {msToReadableDuration(meetingEvent.duration)}
              </span>
            </div>
            <p className="text-small text-dim">{meetingEvent.description}</p>
          </div>
        ))}
    </div>
  )
}
