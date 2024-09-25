"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeslot } from "@/lib/types/timeslot.type"
import SelectedTimeslotCard from "./selected-timeslot-card"
import { Mentor } from "@/lib/types/user.type"
import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"
import { useState } from "react"
import {
  ContractEvent,
  watchForEvent,
  writeBookSession,
} from "@/lib/actions/web3/contract"
import { useUser } from "@/services/user.service"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { FaCircleCheck } from "react-icons/fa6"
import PaymentTab from "./payment-tab"

export default function PaymentAndValidationCard({
  mentor,
  timeslot,
  setSuccess,
  handleEditTimeslot,
}: {
  mentor: Mentor
  timeslot: Timeslot
  setSuccess: (success: boolean) => void
  handleEditTimeslot: () => void
}) {
  const { user } = useUser()
  const [processingPayment, setProcessingPayment] = useState<boolean>(false)

  const isFree = mentor.hourlyRate === 0

  async function handlePayment(): Promise<void> {
    if (!user?.address) return

    setProcessingPayment(true)

    // Determine the ETH / USDC amount to be paid from the mentor's hourly rate
    const usdAmountDue = mentor.hourlyRate
    const ethAmount = 0.001

    toast({
      title: "Processing payment...",
      action: <Loader fill="white" color="primary" size="4" />,
    })

    try {
      await writeBookSession({
        studentAddress: user?.address,
        mentorAddress: mentor.address,
        ethPayment: ethAmount.toString(),
      })

      toast({
        title: "Locking funds...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.SESSION_BOOKED,
        args: { student: user.address },
        handler: () => {
          setProcessingPayment(false)
          setSuccess(true)

          toast({
            title: "Success",
            description: "Payment processed successfully !",
            action: <FaCircleCheck className="text-white" />,
          })
        },
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Payment cancelled, please try again",
      })

      setProcessingPayment(false)
    }
  }

  function handleConfirmSession(): void {
    if (!isFree) return

    setSuccess(true)
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

        {isFree ? (
          <Button
            onClick={handleConfirmSession}
            variant="secondary"
            className="self-end"
          >
            Book session <IoIosFlash className="text-lg" />
          </Button>
        ) : (
          <PaymentTab
            mentor={mentor}
            handlePayment={handlePayment}
            processingPayment={processingPayment}
          />
        )}
      </CardContent>
    </Card>
  )
}
