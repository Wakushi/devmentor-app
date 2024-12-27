import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { getUserTimezone } from "@/services/user.service"
import { Address } from "viem"

export default function useUserTimezoneQuery(address: Address) {
  const timezoneQuery = useQuery<string, Error>({
    queryKey: [QueryKeys.TIMEZONE],
    queryFn: () => getUserTimezone(address),
  })

  return timezoneQuery
}
