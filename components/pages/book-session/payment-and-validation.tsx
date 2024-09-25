"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeslot } from "@/lib/types/timeslot.type"
import SelectedTimeslotCard from "./selected-timeslot-card"
import { Mentor } from "@/lib/types/user.type"
import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"
import { useState } from "react"

export default function PaymentAndValidationCard({
  mentor,
  timeslot,
  handleEditTimeslot,
}: {
  mentor: Mentor
  timeslot: Timeslot
  handleEditTimeslot: () => void
}) {
  const [paid, setPaid] = useState<boolean>(false)

  console.log("mentor: ", mentor)

  async function handlePayment(): Promise<void> {
    // Determine the ETH / USDC amount to be paid from the mentor's hourly rate
    const usdAmountDue = mentor.hourlyRate

    // Call the smart contract with the value sent and the session data

    // Update the state to show payment success
  }

  return (
    <Card className="flex flex-col flex-1 max-w-[800px] h-fit glass text-white border-none fade-in-bottom">
      <CardHeader>
        <CardTitle>Let's Double-Check</CardTitle>
        <p className="text-dim">Exciting details of your upcoming session</p>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4">
        <SelectedTimeslotCard
          timeslot={timeslot}
          handleEditTimeslot={handleEditTimeslot}
        />

        <Button variant="secondary" disabled={!paid} className="self-end">
          Book session <IoIosFlash className="text-lg" />
        </Button>
      </CardContent>
    </Card>
  )
}
