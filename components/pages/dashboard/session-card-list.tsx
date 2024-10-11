"use client"
import { Session } from "@/lib/types/session.type"
import { SessionCard } from "./session-card"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import { Mentor, Student } from "@/lib/types/user.type"
import { Address } from "viem"
import { Role } from "@/lib/types/role.type"
import { getStudent } from "@/services/contract.service"

export default function SessionCardList({
  sessions,
  viewerRole,
}: {
  sessions: Session[]
  viewerRole: Role
}) {
  const mentorsQuery = useMentorsQuery()

  if (viewerRole === Role.STUDENT) {
    populateSessionsMentors()
  }

  if (viewerRole === Role.MENTOR) {
    populateSessionsStudents()
  }

  function populateSessionsMentors() {
    const { data: mentors } = mentorsQuery

    const mentorByAddress: Map<Address, Mentor> = new Map()

    if (mentors) {
      sessions = sessions.map((session) => {
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

        return { ...session, mentor }
      })
    }
  }

  async function populateSessionsStudents() {
    const studentByAddress: Map<Address, Student> = new Map()

    for (let session of sessions) {
      const { studentAddress } = session

      if (studentByAddress.has(studentAddress)) {
        session.student = studentByAddress.get(studentAddress)!
      } else {
        const student = await getStudent(studentAddress)

        if (!student) continue

        studentByAddress.set(studentAddress, student)
        session.student = student
      }
    }
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {sessions?.map((session, i) => (
        <SessionCard key={"session-" + i} session={session} viewerRole={viewerRole} />
      ))}
    </div>
  )
}
