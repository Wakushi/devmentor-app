"use client"
import { Session } from "@/lib/types/session.type"
import { SessionCard } from "./session-card"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import { MentorStruct } from "@/lib/types/user.type"
import { Address } from "viem"

export default function SessionCardList({ sessions }: { sessions: Session[] }) {
  const mentorsQuery = useMentorsQuery()
  const { data: mentors } = mentorsQuery

  const mentorByAddress: Map<Address, MentorStruct> = new Map()

  if (mentors) {
    sessions = sessions.map((session) => {
      let mentor: MentorStruct | undefined
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

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {sessions?.map((session, i) => (
        <SessionCard key={"session-" + i} session={session} />
      ))}
    </div>
  )
}
