import { useQuery } from "@tanstack/react-query"
import { Session } from "@/lib/types/session.type"
import { MentorStruct, Student } from "@/lib/types/user.type"
import { QueryKeys } from "@/lib/types/query-keys.type"

export default function useSessionsQuery(
  user: Student | MentorStruct | null | undefined
) {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: [QueryKeys.SESSIONS, user?.account],
    queryFn: async () => {
      const response = await fetch(
        `/api/session?studentAddress=${user?.account}`
      )
      const { sessions } = await response.json()
      return sessions
    },
  })

  return sessionsQuery
}
