import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { Mentor } from "@/lib/types/user.type"
import { FaDollarSign } from "react-icons/fa"

export default function PaymentTab({
  mentor,
  handlePayment,
  processingPayment,
}: {
  mentor: Mentor
  handlePayment: () => void
  processingPayment: boolean
}) {
  return (
    <div>
      <div className="flex flex-col mb-4">
        <h3 className="text-2xl">Payment</h3>
        <p className="text-dim text-base">
          Funds will only be sent to your mentor at the end of the session.
        </p>
      </div>
      <div>
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
      </div>
    </div>
  )
}
