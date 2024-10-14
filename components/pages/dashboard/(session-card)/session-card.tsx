"use client"

import { Session } from "@/lib/types/session.type"
import SessionConfirmationStatus from "../session-confirmation-status"
import SessionPeer from "./session-peer"
import SessionTime from "./session-time"
import SessionTopic from "./session-topic"
import SessionPrice from "./session-price"
import { Role } from "@/lib/types/role.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { GoGoal } from "react-icons/go"
import StudentContactDialog from "@/components/student-contact-dialog"
import { RiContactsBook3Fill } from "react-icons/ri"
import StudentGoalsDialog from "@/components/student-goals-dialog"
import SessionOptions from "./session-options"

export function SessionCard({
  user,
  session,
}: {
  user: Mentor | Student
  session: Session
}) {
  const { startTime, endTime, valueLocked, mentor, student, topic } = session

  function isMentorView(): boolean {
    return user.role === Role.MENTOR
  }

  function isPastSession(): boolean {
    return session.endTime < Date.now()
  }

  return (
    <div className="flex items-center justify-between gap-8 glass rounded-md px-4 py-2">
      <div className="flex items-center gap-6">
        <SessionPeer
          name={
            isMentorView()
              ? student?.baseUser?.userName
              : mentor?.baseUser?.userName
          }
        />
        <SessionTime startTime={startTime} endTime={endTime} />
        <div className="flex flex-col gap-2">
          <SessionTopic topic={topic} />
          <SessionPrice sessionPriceWei={valueLocked} />
        </div>
        <div className="flex flex-col gap-2">
          {user.role === Role.MENTOR && (
            <>
              <StudentGoalsDialog sessionGoalHash={session.sessionGoalHash}>
                <div className="flex items-center gap-2 text-dm-accent">
                  <GoGoal />
                  <span className="text-small hover:underline">Objectives</span>
                </div>
              </StudentGoalsDialog>

              <StudentContactDialog contactHash={session.studentContactHash}>
                <div className="flex items-center gap-2 text-primary">
                  <RiContactsBook3Fill />
                  <span className="text-small hover:underline">
                    Student contact
                  </span>
                </div>
              </StudentContactDialog>
            </>
          )}
        </div>
        {isPastSession() && (
          <SessionConfirmationStatus
            session={session}
            currentUserRole={user.role}
          />
        )}
      </div>
      <SessionOptions session={session} user={user} />
    </div>
  )
}
