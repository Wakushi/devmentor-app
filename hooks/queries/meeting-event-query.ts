import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { Address } from "viem"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { getMeetingEventsByAddress } from "@/services/user.service"

export default function useMeetingEventsQuery(address: Address) {
  const meetingEventsQuery = useQuery<MeetingEvent[], Error>({
    queryKey: [QueryKeys.MEETING_EVENTS, address],
    queryFn: async () => {
      if (!address) return []

      const meetingEvents = await getMeetingEventsByAddress(address)

      return meetingEvents
    },
  })

  return meetingEventsQuery
}
