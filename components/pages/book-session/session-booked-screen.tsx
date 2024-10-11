import SuccessScreen from "@/components/success-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { SessionSlot } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"
import { createGoogleCalendarLink } from "@/lib/utils"
import { FaLongArrowAltRight } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

export default function SessionBookedScreen({
  mentor,
  confirmedSessionSlot,
}: {
  mentor: Mentor
  confirmedSessionSlot: SessionSlot
}) {
  const googleCalendarLink = createGoogleCalendarLink({
    title: "Mentoring session",
    description: `Mentoring session with ${mentor.baseUser.userName}`,
    startDate: new Date(confirmedSessionSlot.timeStart),
    endDate: new Date(confirmedSessionSlot.timeEnd),
  })

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <SuccessScreen
        title={`Session booked with ${mentor.baseUser.userName} !`}
        subtitle="You can find all your session detail in the dashboard"
      >
        <div className="max-w-[300px] flex flex-col gap-2 w-full">
          <NavLinkButton href="/student/dashboard" variant="filled">
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
