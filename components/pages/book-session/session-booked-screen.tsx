import SuccessScreen from "@/components/success-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { Session } from "@/lib/types/session.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"
import { createGoogleCalendarLink } from "@/lib/utils"
import { FaLongArrowAltRight } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

export default function SessionBookedScreen({
  mentor,
  confirmedTimeslot,
  createdSession,
}: {
  mentor: Mentor
  confirmedTimeslot: Timeslot
  createdSession: Session
}) {
  const { timeStart, timeEnd, date } = confirmedTimeslot

  const startHours = new Date(timeStart).getHours()
  const endHours = new Date(timeEnd).getHours()

  const startDate = new Date(date)
  startDate.setHours(startHours)

  const endDate = new Date(date)
  endDate.setHours(endHours)

  const googleCalendarLink = createGoogleCalendarLink({
    title: "Mentoring session",
    description: `Mentoring session with ${
      createdSession.mentor?.name || mentor.name
    }`,
    startDate,
    endDate,
  })

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <SuccessScreen
        title={`Session booked with ${
          createdSession.mentor?.name || mentor.name
        } !`}
        subtitle="You can find all your session detail in the dashboard"
      >
        <div className="max-w-[300px] flex flex-col gap-2 w-full">
          <NavLinkButton href="/dashboard/student" variant="filled">
            Go to dashboard <FaLongArrowAltRight />
          </NavLinkButton>
          <NavLinkButton
            variant="outline"
            target="_blank"
            href={googleCalendarLink}
          >
            Add to calendar
            <FcGoogle />
          </NavLinkButton>
        </div>
      </SuccessScreen>
    </div>
  )
}
