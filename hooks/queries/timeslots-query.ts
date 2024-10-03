import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { Address } from "viem"
import { Timeslot } from "@/lib/types/timeslot.type"

export default function useTimeslotsQuery(address: Address) {
  const timeslotsQuery = useQuery<Timeslot[], Error>({
    queryKey: [QueryKeys.TIMESLOTS, address],
    queryFn: async () => {
      if (!address) return []
      const response = await fetch(`/api/timeslots?address=${address}`)
      const { timeslots } = await response.json()
      return timeslots
    },
  })

  return timeslotsQuery
}
