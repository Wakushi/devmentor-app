import { Button } from "@/components/ui/button"
import { FaLongArrowAltLeft } from "react-icons/fa"

export default function MentorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 min-h-screen">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Mentor not found</h3>
        <p className="text-dim">Sorry, but we couldn't find your mentor.</p>
      </div>
      <Button variant="default" asChild>
        <a href="/student/mentor-search" className="flex items-center gap-2">
          <FaLongArrowAltLeft /> Back to mentor list
        </a>
      </Button>
    </div>
  )
}
