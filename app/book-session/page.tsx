"use client"
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/ui/animated-background"
import MentorDetails from "@/components/pages/book-session/mentor-details"
import SessionCalendar from "@/components/pages/book-session/session-calendar"
import { useEffect, useState } from "react"
import { Mentor } from "@/lib/types/user.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import { generateMockTimeslots } from "@/lib/mock/utils"
import LoadingScreen from "@/components/ui/loading-screen"
import PaymentAndValidationCard from "@/components/pages/book-session/payment-and-validation"
import { IoIosArrowBack } from "react-icons/io"
import NavLinkButton from "@/components/ui/nav-link"
import SuccessScreen from "@/components/success-screen"

enum BookStep {
  TIMESLOT_SELECTION = "TIMESLOT_SELECTION",
  PAYMENT_AND_VALIDATION = "PAYMENT_AND_VALIDATION",
}

export default function BookSessionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const [mentor, setMentor] = useState<Mentor>()
  const [timeslots, setTimeslots] = useState<Timeslot[]>([])
  const [confirmedTimeslot, setConfirmedTimeslot] = useState<Timeslot>()
  const [loading, setLoading] = useState<boolean>(true)
  const [success, setSuccess] = useState<boolean>(false)

  const [bookStep, setBookStep] = useState<BookStep>(
    BookStep.TIMESLOT_SELECTION
  )

  useEffect(() => {
    async function fetchMentor() {
      const matchingMentor = MENTORS_MOCK.find(
        (m) => m.address === searchParams?.mentor
      )

      if (!matchingMentor) return

      setMentor(matchingMentor)
    }

    fetchMentor()
  }, [])

  useEffect(() => {
    async function fetchMentorTimeslots() {
      const mentorSlots = generateMockTimeslots(
        new Date("2024-09-25"),
        2
      ).filter((slot) => !slot.isBooked)

      setTimeslots(mentorSlots)
      setLoading(false)
    }

    fetchMentorTimeslots()
  }, [mentor])

  function handleConfirmTimeslot(selectedSlot: Timeslot): void {
    if (!selectedSlot) return

    setConfirmedTimeslot(selectedSlot)
    setBookStep(BookStep.PAYMENT_AND_VALIDATION)
  }

  function handleEditTimeslot(): void {
    setBookStep(BookStep.TIMESLOT_SELECTION)
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!searchParams?.mentor || !mentor) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-4 min-h-screen">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Mentor not found</h3>
          <p className="text-dim">Sorry, but we couldn't find your mentor.</p>
        </div>
        <Button variant="default" asChild>
          <a href="/mentor-search" className="flex items-center gap-2">
            <FaLongArrowAltLeft /> Back to mentor list
          </a>
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-screen">
        <SuccessScreen
          title="Session booked with success !"
          subtitle="You can find all your session detail in the dashboard"
        >
          <div className="max-w-[300px]">
            <NavLinkButton href="/dashboard/student" variant="filled">
              Go to dashboard <FaLongArrowAltRight />
            </NavLinkButton>
          </div>
        </SuccessScreen>
      </div>
    )
  }

  return (
    <>
      <div className="flex glass rounded-md flex-col gap-4 p-8 mt-[8rem] h-fit max-w-[95%] mx-auto w-full">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Book a session</h1>
            <p className="text-dim">
              Pick out the perfect time for your mentoring session
            </p>
          </div>
          <div className="flex items-center self-baseline">
            <NavLinkButton href="/mentor-search">
              <IoIosArrowBack />
              Back to search
            </NavLinkButton>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <MentorDetails mentor={mentor} />

          {bookStep === BookStep.TIMESLOT_SELECTION && (
            <SessionCalendar
              timeslots={timeslots}
              selectedTimeslot={confirmedTimeslot}
              handleConfirmTimeslot={handleConfirmTimeslot}
            />
          )}

          {bookStep === BookStep.PAYMENT_AND_VALIDATION &&
            confirmedTimeslot && (
              <PaymentAndValidationCard
                mentor={mentor}
                timeslot={confirmedTimeslot}
                setSuccess={setSuccess}
                handleEditTimeslot={handleEditTimeslot}
              />
            )}
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </>
  )
}
