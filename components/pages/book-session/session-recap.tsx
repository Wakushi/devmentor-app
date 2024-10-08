"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SessionSlot } from "@/lib/types/timeslot.type"
import SelectedTimeslotCard from "./selected-timeslot-card"
import SessionGoalEditable from "./session-goal-editable"
import { BookStep } from "@/lib/types/book-session-form.type"

export default function SessionRecap({
  confirmedSessionSlot,
  sessionGoals,
  handleEditStep,
}: {
  confirmedSessionSlot: SessionSlot
  sessionGoals: string
  handleEditStep: (step: BookStep) => void
}) {
  return (
    <Card className="flex flex-col h-fit w-full glass text-white border-none fade-in-bottom">
      <CardHeader>
        <h3 className="text-2xl">Let's Recap !</h3>
        <p className="text-dim text-base">
          Exciting details of your upcoming session
        </p>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4">
        <SelectedTimeslotCard
          confirmedSessionSlot={confirmedSessionSlot}
          handleEditStep={handleEditStep}
        />
        <SessionGoalEditable
          sessionGoals={sessionGoals}
          handleEditStep={handleEditStep}
        />
      </CardContent>
    </Card>
  )
}
