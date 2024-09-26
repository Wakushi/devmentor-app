import { useQuery } from "@tanstack/react-query"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { QueryKeys } from "@/lib/types/query-keys.type"

export default function useSessionsQuery(
  user: Student | Mentor | null | undefined
) {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: [QueryKeys.SESSIONS, user?.address],
    queryFn: async () => {
      const response = await fetch(
        `/api/session?studentAddress=${user?.address}`
      )
      const { sessions } = await response.json()
      return sessions
    },
  })

  return sessionsQuery
}
