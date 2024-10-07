import { Button } from "@/components/ui/button"
import { Mentor } from "@/lib/types/user.type"
import { FaDollarSign } from "react-icons/fa"
import { IoIosFlash } from "react-icons/io"

export default function CompleteSessionButton({
  mentor,
  handleCreateSession,
}: {
  mentor: Mentor
  handleCreateSession: () => void
}) {
  if (mentor.hourlyRate === 0) {
    return (
      <Button
        onClick={handleCreateSession}
        variant="secondary"
        className="self-end"
      >
        Book session <IoIosFlash className="text-lg" />
      </Button>
    )
  }

  return (
    <Button onClick={handleCreateSession}>
      <FaDollarSign className="text-xl" />
      Lock {mentor.hourlyRate} USD
    </Button>
  )
}
