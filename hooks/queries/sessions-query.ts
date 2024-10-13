import { useQuery } from "@tanstack/react-query"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { QueryKeys } from "@/lib/types/query-keys.type"
import {
  getSession,
  getSessionIdsByAccount,
  getStudent,
} from "@/services/contract.service"
import { Address } from "viem"

export default function useSessionsQuery(
  user: Student | Mentor | null | undefined,
  populateWith: "students" | "mentors" | "none" = "none",
  mentors?: Mentor[]
) {
  const sessionsQuery = useQuery<Session[], Error>({
    queryKey: [QueryKeys.SESSIONS, user?.account],
    queryFn: async () => {
      if (!user?.account) return []

      const sessions: Session[] = []
      const sessionsIds = await getSessionIdsByAccount(user?.account)

      for (let sessionId of sessionsIds) {
        const session = await getSession(sessionId)

        if (!session) continue

        if (populateWith === "students") {
          await populateWithStudents(session)
        }

        if (populateWith === "mentors" && mentors) {
          await populateWithMentors(session, mentors)
        }

        sessions.push(session)
      }

      return sessions.sort((a, b) => a.startTime - b.startTime)
    },
  })

  return sessionsQuery
}

async function populateWithStudents(session: Session) {
  const studentByAddress: Map<Address, Student> = new Map()
  const { studentAddress } = session

  if (studentByAddress.has(studentAddress)) {
    session.student = studentByAddress.get(studentAddress)!
  } else {
    const student = await getStudent(studentAddress)
    studentByAddress.set(studentAddress, student)
    session.student = student
  }
}

async function populateWithMentors(session: Session, mentors: Mentor[]) {
  const mentorByAddress: Map<Address, Mentor> = new Map()

  if (mentors) {
    let mentor: Mentor | undefined
    const { mentorAddress } = session

    if (mentorByAddress.has(mentorAddress)) {
      mentor = mentorByAddress.get(mentorAddress)!
    } else {
      mentor = mentors.find((m) => m.account === mentorAddress)

      if (mentor) {
        mentorByAddress.set(mentorAddress, mentor)
      }
    }

    session.mentor = mentor
  }
}
