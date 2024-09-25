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
import { FaDollarSign, FaLock } from "react-icons/fa"
import { FaCircleCheck } from "react-icons/fa6"

export default function PaymentAndValidationCard({
  mentor,
  timeslot,
  handleEditTimeslot,
}: {
  mentor: Mentor
  timeslot: Timeslot
  handleEditTimeslot: () => void
}) {
  const { user } = useUser()
  const [paid, setPaid] = useState<boolean>(false)
  const [processingPayment, setProcessingPayment] = useState<boolean>(false)

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
        title: "Creating session...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.SESSION_BOOKED,
        args: { student: user.address },
        handler: (logs: any) => {
          setProcessingPayment(false)
          setPaid(true)

          toast({
            title: "Success",
            description: "Session created with success !",
            action: <FaCircleCheck className="text-white" />,
          })
        },
      })
    } catch (error: any) {
      console.log("handlePayment error: ", error)

      toast({
        title: "Error",
        description: error,
      })

      setProcessingPayment(false)
    }
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

        <div>
          <div className="flex flex-col mb-4">
            <h3 className="text-2xl">Payment</h3>
            <p className="text-dim text-base">
              Funds will only be sent to your mentor at the end of the session.
            </p>
          </div>
          <div>
            {paid ? (
              <div className="button-base pointer-events-none border-success bg-success">
                <FaLock />
                {mentor.hourlyRate} USD locked
              </div>
            ) : (
              <Button className="min-w-[200px]" onClick={handlePayment}>
                {processingPayment ? (
                  <Loader size="4" />
                ) : (
                  <>
                    <FaDollarSign className="text-xl" />
                    Lock {mentor.hourlyRate} USD
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {!!!mentor.hourlyRate && (
          <Button variant="secondary" className="self-end">
            Book session <IoIosFlash className="text-lg" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
