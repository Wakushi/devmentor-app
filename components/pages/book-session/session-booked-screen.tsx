import SuccessScreen from "@/components/success-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { Timeslot } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"
import { createGoogleCalendarLink, getTimeslotStartTime } from "@/lib/utils"
import { FaLongArrowAltRight } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

export default function SessionBookedScreen({
  mentor,
  confirmedTimeslot,
}: {
  mentor: Mentor
  confirmedTimeslot: Timeslot
}) {
  const googleCalendarLink = createGoogleCalendarLink({
    title: "Mentoring session",
    description: `Mentoring session with ${mentor.baseUser.userName}`,
    startDate: new Date(getTimeslotStartTime(confirmedTimeslot)),
    endDate: new Date(getTimeslotStartTime(confirmedTimeslot)),
  })

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <SuccessScreen
        title={`Session booked with ${mentor.baseUser.userName} !`}
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
