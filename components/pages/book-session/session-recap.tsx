"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeslot } from "@/lib/types/timeslot.type"
import SelectedTimeslotCard from "./selected-timeslot-card"
import SessionGoalEditable from "./session-goal-editable"

export default function SessionRecap({
  timeslot,
  sessionGoals,
  handleEditTimeslot,
  handleEditSessionGoals,
}: {
  timeslot: Timeslot
  sessionGoals: string
  handleEditTimeslot: () => void
  handleEditSessionGoals: () => void
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
          timeslot={timeslot}
          handleEditTimeslot={handleEditTimeslot}
        />
        <SessionGoalEditable
          sessionGoals={sessionGoals}
          handleEditSessionGoals={handleEditSessionGoals}
        />
      </CardContent>
    </Card>
  )
}
