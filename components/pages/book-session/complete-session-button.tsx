import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { MentorStruct } from "@/lib/types/user.type"
import { FaDollarSign } from "react-icons/fa"
import { IoIosFlash } from "react-icons/io"

export default function CompleteSessionButton({
  mentor,
  handlePayment,
  processingPayment,
  handleConfirmFreeSession,
}: {
  mentor: MentorStruct
  handlePayment: () => void
  processingPayment: boolean
  handleConfirmFreeSession: () => void
}) {
  if (mentor.hourlyRate === 0) {
    return (
      <Button
        onClick={handleConfirmFreeSession}
        variant="secondary"
        className="self-end"
      >
        Book session <IoIosFlash className="text-lg" />
      </Button>
    )
  }

  return (
    <Button onClick={handlePayment}>
      {processingPayment ? (
        <Loader size="4" />
      ) : (
        <>
          <FaDollarSign className="text-xl" />
          Lock {mentor.hourlyRate} USD
        </>
      )}
    </Button>
  )
}
