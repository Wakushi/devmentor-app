"use client"

import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import AnimatedBackground from "@/components/ui/animated-background"
import MentorDetails from "@/components/pages/book-session/mentor-details"
import SessionCalendar from "@/components/pages/book-session/session-calendar"
import { useEffect, useState } from "react"
import { Mentor } from "@/lib/types/user.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import { generateMockTimeslots } from "@/lib/mock/utils"
import LoadingScreen from "@/components/ui/loading-screen"
import SessionRecap from "@/components/pages/book-session/session-recap"
import { IoIosArrowBack } from "react-icons/io"
import NavLinkButton from "@/components/ui/nav-link"
import { Session } from "@/lib/types/session.type"
import Stepper from "@/components/pages/auth/stepper"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SessionGoalInput from "@/components/pages/book-session/session-goal"
import {
  ContractEvent,
  watchForEvent,
  writeBookSession,
} from "@/lib/actions/web3/contract"
import { useUser } from "@/services/user.service"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { FaCircleCheck } from "react-icons/fa6"
import { getStartTime } from "@/lib/utils"
import SessionBookedScreen from "@/components/pages/book-session/session-booked-screen"
import MentorNotFound from "@/components/pages/book-session/mentor-not-found"
import BookSessionNavigation from "@/components/pages/book-session/book-session-navigation"

export enum BookStep {
  TIMESLOT_SELECTION = "TIMESLOT_SELECTION",
  SESSION_GOALS = "SESSION_GOALS",
  PAYMENT_AND_VALIDATION = "PAYMENT_AND_VALIDATION",
}

export default function BookSessionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { user } = useUser()

  const [mentor, setMentor] = useState<Mentor>()
  const [timeslots, setTimeslots] = useState<Timeslot[]>([])
  const [confirmedTimeslot, setConfirmedTimeslot] = useState<Timeslot>()
  const [loading, setLoading] = useState<boolean>(true)
  const [createdSession, setCreatedSession] = useState<Session | null>(null)
  const [sessionGoals, setSessionGoals] = useState<string>("")
  const [processingPayment, setProcessingPayment] = useState<boolean>(false)
  const [editedStep, setEditedStep] = useState<BookStep | null>(null)

  const [bookStep, setBookStep] = useState<BookStep>(
    BookStep.TIMESLOT_SELECTION
  )

  const steps = Array.from(Object.keys(BookStep) as BookStep[])

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

    if (editedStep === BookStep.TIMESLOT_SELECTION) {
      setEditedStep(null)
      setBookStep(BookStep.PAYMENT_AND_VALIDATION)
      return
    }

    setBookStep(BookStep.SESSION_GOALS)
  }

  function currentStepIndex(): number {
    return getStepIndex(bookStep)
  }

  function getStepIndex(step: BookStep): number {
    return steps.findIndex((s) => s === step)
  }

  function isCurrentStepValid(): boolean {
    switch (bookStep) {
      case BookStep.TIMESLOT_SELECTION:
        return false
      case BookStep.SESSION_GOALS:
        return sessionGoals.length > 10 && sessionGoals.length < 1000
      case BookStep.PAYMENT_AND_VALIDATION:
        return false
      default:
        return false
    }
  }

  function handleNextStep(): void {
    switch (bookStep) {
      case BookStep.TIMESLOT_SELECTION:
        setBookStep(BookStep.SESSION_GOALS)
        break
      case BookStep.SESSION_GOALS:
        setBookStep(BookStep.PAYMENT_AND_VALIDATION)
        break
    }
  }

  function handlePrevStep(): void {
    switch (bookStep) {
      case BookStep.SESSION_GOALS:
        setBookStep(BookStep.TIMESLOT_SELECTION)
        break
      case BookStep.PAYMENT_AND_VALIDATION:
        setBookStep(BookStep.SESSION_GOALS)
        break
    }
  }

  function handleStepClick(step: BookStep): void {
    if (getStepIndex(step) < currentStepIndex()) {
      setBookStep(step)
      return
    }

    if (!isCurrentStepValid()) return

    setBookStep(step)
  }

  async function handlePayment(): Promise<void> {
    if (!user?.address || !mentor) return

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
        title: "Locking funds...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.SESSION_BOOKED,
        args: { student: user.address },
        handler: async () => {
          const session = await createSession()

          if (!session) return

          setProcessingPayment(false)
          setCreatedSession(session)

          toast({
            title: "Success",
            description: "Payment processed successfully !",
            action: <FaCircleCheck className="text-white" />,
          })
        },
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Payment cancelled, please try again",
      })

      setProcessingPayment(false)
    }
  }

  async function handleConfirmFreeSession(): Promise<void> {
    if (mentor?.hourlyRate && mentor?.hourlyRate > 0) return

    const session = await createSession()

    if (!session) return

    setCreatedSession(session)
  }

  function handleEditStep(step: BookStep): void {
    setEditedStep(step)
    setBookStep(step)
  }

  async function createSession(): Promise<Session | null> {
    if (!user?.address || !mentor || !confirmedTimeslot) return null

    const sessionPayload: Session = {
      mentorAddress: mentor.address,
      studentAddress: user?.address,
      objectives: sessionGoals,
      startTime: getStartTime(confirmedTimeslot),
      valueLocked: mentor.hourlyRate,
      cancelled: false,
    }

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionPayload),
    })

    const { createdSession } = await response.json()
    return { ...createdSession, mentor }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!searchParams?.mentor || !mentor) {
    return <MentorNotFound />
  }

  if (!!createdSession && confirmedTimeslot) {
    return (
      <SessionBookedScreen
        mentor={mentor}
        confirmedTimeslot={confirmedTimeslot}
        createdSession={createdSession}
      />
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

          <Card className="flex-1 flex-col items-center justify-center text-white border-stone-800 text-start glass">
            <CardHeader className="flex flex-col items-center gap-6">
              <Stepper
                steps={steps}
                currentStep={bookStep}
                handleStepClick={(step: BookStep) => handleStepClick(step)}
              />
              <Separator className="opacity-30" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              {bookStep === BookStep.TIMESLOT_SELECTION && (
                <SessionCalendar
                  timeslots={timeslots}
                  selectedTimeslot={confirmedTimeslot}
                  handleConfirmTimeslot={handleConfirmTimeslot}
                />
              )}

              {bookStep === BookStep.SESSION_GOALS && (
                <SessionGoalInput
                  sessionGoals={sessionGoals}
                  setSessionGoals={setSessionGoals}
                />
              )}

              {bookStep === BookStep.PAYMENT_AND_VALIDATION &&
                confirmedTimeslot && (
                  <SessionRecap
                    timeslot={confirmedTimeslot}
                    sessionGoals={sessionGoals}
                    handleEditStep={handleEditStep}
                  />
                )}

              <BookSessionNavigation
                bookStep={bookStep}
                steps={steps}
                currentStepIndex={currentStepIndex()}
                currentStepValid={isCurrentStepValid()}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                mentor={mentor}
                handlePayment={handlePayment}
                processingPayment={processingPayment}
                handleConfirmFreeSession={handleConfirmFreeSession}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </>
  )
}
