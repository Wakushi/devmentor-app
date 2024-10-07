import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { Address } from "viem"
import { Timeslot } from "@/lib/types/timeslot.type"
import { getTimeslotsByAddress } from "@/services/user.service"

export default function useTimeslotsQuery(address: Address) {
  const timeslotsQuery = useQuery<Timeslot[], Error>({
    queryKey: [QueryKeys.TIMESLOTS, address],
    queryFn: async () => {
      if (!address) return []
      const timeslots = await getTimeslotsByAddress(address)
      return timeslots
    },
  })

  return timeslotsQuery
}
