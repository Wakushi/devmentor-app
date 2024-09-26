import { QueryKeys } from "@/lib/types/query-keys.type"
import { Mentor } from "@/lib/types/user.type"
import { useQuery } from "@tanstack/react-query"

export default function useMentorsQuery() {
  const mentorsQuery = useQuery<Mentor[], Error>({
    queryKey: [QueryKeys.SESSIONS],
    queryFn: async () => {
      const response = await fetch("/api/user/mentors")
      const { mentors } = await response.json()
      return mentors
    },
  })

  return mentorsQuery
}
