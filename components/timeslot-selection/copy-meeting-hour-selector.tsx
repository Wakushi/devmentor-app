import { MeetingEvent } from "@/lib/types/timeslot.type"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export default function CopyMeetingHourSelector({
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
