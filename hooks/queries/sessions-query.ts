import { useQuery } from "@tanstack/react-query"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { getSession, getSessionIdsByAccount } from "@/services/contract.service"

export default function useSessionsQuery(
  user: Student | Mentor | null | undefined
) {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: [QueryKeys.SESSIONS, user?.account],
    queryFn: async () => {
      if (!user?.account) return []

      const sessions: Session[] = []
      const sessionsIds = await getSessionIdsByAccount(user?.account)

      for (let sessionId of sessionsIds) {
        const session = await getSession(sessionId)
        sessions.push(session)
      }

      return sessions
    },
  })

  return sessionsQuery
}
