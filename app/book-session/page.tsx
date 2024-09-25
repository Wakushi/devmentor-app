"use client"
import { FaLongArrowAltLeft } from "react-icons/fa"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/ui/animated-background"
import MentorDetails from "@/components/pages/book-session/mentor-details"
import SessionCalendar from "@/components/pages/book-session/session-calendar"

export default function BookSessionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const mentor = MENTORS_MOCK.find((m) => m.address === searchParams?.mentor)

  if (!searchParams?.mentor || !mentor) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-4 min-h-screen">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Mentor not found</h3>
          <p className="text-gray-600">
            Sorry, but we couldn't find your mentor.
          </p>
        </div>
        <Button variant="default" asChild>
          <a href="/mentor-search" className="flex items-center gap-2">
            <FaLongArrowAltLeft /> Back to mentor list
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-[8rem] min-h-screen max-w-[90%] mx-auto w-full">
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-2">Book a session</h1>
        <p className="text-gray-600">
          Pick out the perfect time for your mentoring session
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <MentorDetails mentor={mentor} />
        <SessionCalendar />
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
