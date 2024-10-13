"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import MentorDetails from "@/components/pages/book-session/mentor-details"
import SessionCalendar from "@/components/pages/book-session/session-calendar"
import { useEffect, useState } from "react"
import { MeetingEvent, SessionSlot } from "@/lib/types/timeslot.type"
import LoadingScreen from "@/components/ui/loading-screen"
import SessionRecap from "@/components/pages/book-session/session-recap"
import { IoIosArrowBack } from "react-icons/io"
import NavLinkButton from "@/components/ui/nav-link"
import { Session } from "@/lib/types/session.type"
import Stepper from "@/components/pages/auth/stepper"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SessionGoalInput from "@/components/pages/book-session/session-goal"
import { useUser } from "@/stores/user.store"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { FaCircleCheck } from "react-icons/fa6"
import SessionBookedScreen from "@/components/pages/book-session/session-booked-screen"
import MentorNotFound from "@/components/pages/book-session/mentor-not-found"
import BookSessionNavigation from "@/components/pages/book-session/book-session-navigation"
import { BookStep } from "@/lib/types/book-session-form.type"
import { Mentor, Student } from "@/lib/types/user.type"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import {
  ContractEvent,
  createSession,
  getSession,
  usdToWei,
  watchForEvent,
} from "@/services/contract.service"
import { computeTimeAndDateTimestamps } from "@/lib/utils"
import SessionEventSelector from "@/components/pages/book-session/session-event-selector"
import { decryptWithSignature, encryptForAddress } from "@/lib/crypto/crypto"
import { useSignMessage } from "wagmi"
import { pinJSON } from "@/services/ipfs.service"

export default function BookSessionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { user } = useUser() as {
    user: Student
  }
  const { signMessageAsync } = useSignMessage()

  const mentorsQuery = useMentorsQuery()
  const ethPriceQuery = useEthPriceQuery()

  const { data: ethPriceUsd } = ethPriceQuery
  const { data: mentors } = mentorsQuery

  const [mentor, setMentor] = useState<Mentor>()

  const [bookStep, setBookStep] = useState<BookStep>(BookStep.SESSION)

  const [sessionGoals, setSessionGoals] = useState<string>("")

  const [editedStep, setEditedStep] = useState<BookStep | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const [createdSession, setCreatedSession] = useState<Session | null>(null)

  const [selectedMeetingEvent, setSelectedMeetingEvent] =
    useState<MeetingEvent | null>(null)

  const [confirmedSessionSlot, setConfirmedSessionSlot] =
    useState<SessionSlot>()

  const [loading, setLoading] = useState<boolean>(false)

  const [loadingMessage, setLoadingMessage] = useState<string>("")

  const steps = Array.from(Object.keys(BookStep) as BookStep[])

  useEffect(() => {
    async function fetchMentor() {
      if (!mentors) return

      const matchingMentor = mentors.find(
        (m) => m.account === searchParams?.mentor
      )

      if (!matchingMentor) return

      setMentor(matchingMentor)
    }

    fetchMentor()
  }, [mentors])

  function handleConfirmTimeslot(selectedSlot: number): void {
    if (!selectedSlot || !selectedMeetingEvent || !selectedDate) return

    const sessionDate = computeSessionSlot({
      time: selectedSlot,
      date: selectedDate,
      duration: selectedMeetingEvent?.duration,
    })

    setConfirmedSessionSlot(sessionDate)

    if (editedStep === BookStep.SCHEDULE) {
      setEditedStep(null)
      setBookStep(BookStep.RECAP)
      return
    }

    setBookStep(BookStep.OBJECTIVES)
  }

  function handleSelectEvent(meetingEvent: MeetingEvent) {
    setSelectedMeetingEvent(meetingEvent)
    handleSelectDate(undefined)
  }

  function currentStepIndex(): number {
    return getStepIndex(bookStep)
  }

  function getStepIndex(step: BookStep): number {
    return steps.findIndex((s) => s === step)
  }

  function isCurrentStepValid(): boolean {
    switch (bookStep) {
      case BookStep.SESSION:
        return !!selectedMeetingEvent
      case BookStep.SCHEDULE:
        return false
      case BookStep.OBJECTIVES:
        return sessionGoals.length > 10 && sessionGoals.length < 1000
      case BookStep.RECAP:
        return false
      default:
        return false
    }
  }

  function handleNextStep(): void {
    switch (bookStep) {
      case BookStep.SESSION:
        setBookStep(BookStep.SCHEDULE)
        break
      case BookStep.SCHEDULE:
        setBookStep(BookStep.OBJECTIVES)
        break
      case BookStep.OBJECTIVES:
        setBookStep(BookStep.RECAP)
        break
    }
  }

  function handlePrevStep(): void {
    switch (bookStep) {
      case BookStep.SCHEDULE:
        setBookStep(BookStep.SESSION)
        break
      case BookStep.OBJECTIVES:
        setBookStep(BookStep.SCHEDULE)
        break
      case BookStep.RECAP:
        setBookStep(BookStep.OBJECTIVES)
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

  function handleEditStep(step: BookStep): void {
    setEditedStep(step)
    setBookStep(step)
  }

  function handleSelectDate(date: Date | undefined): void {
    setSelectedDate(date)
  }

  async function handleCreateSession(): Promise<void> {
    if (!user?.account || !mentor) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "User not found, please try again later.",
      })
      return
    }

    if (!confirmedSessionSlot || !selectedMeetingEvent) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please select a valid time slot.",
      })
      return
    }

    if (mentor.hourlyRate && !ethPriceUsd) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "Unable to fetch current ETH price, please try again later.",
      })
      return
    }

    let ethAmount = BigInt(0)

    if (mentor.hourlyRate && ethPriceUsd) {
      const usdAmountDue = mentor.hourlyRate
      ethAmount = usdToWei(usdAmountDue, ethPriceUsd)
    }

    setLoadingMessage("We're preparing your session")
    setLoading(true)

    toast({
      title: "Pending signature to confirm session creation...",
      action: <Loader fill="white" color="primary" size="4" />,
    })

    try {
      const message = `Please sign to share your contact information with your mentor (${mentor.baseUser.userName}).`
      const signature = await signMessageAsync({
        message,
      })

      const contact = await decryptWithSignature({
        encryptedData: user.contactHash,
        address: user.account,
        signature,
        message,
      })

      toast({
        title: "Verifying signature...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      const encryptedContact = await encryptForAddress(contact, mentor.account)
      const sessionGoalHash = await pinJSON({ sessionGoals })

      await createSession({
        account: user.account,
        mentorAddress: mentor.account,
        startTime: confirmedSessionSlot.timeStart,
        endTime: confirmedSessionSlot.timeEnd,
        studentContactHash: encryptedContact,
        sessionGoalHash,
        value: ethAmount,
      })

      toast({
        title: "Creating session...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.SESSION_CREATED,
        args: { studentAccount: user.account },
        handler: async (logs) => {
          const session: any = await getSession(logs[0].args.sessionId)

          if (!session) return

          setLoading(false)
          setCreatedSession(session)

          toast({
            title: "Success",
            description: "Session created successfully !",
            action: <FaCircleCheck className="text-white" />,
          })
        },
      })
    } catch (error: any) {
      console.log("error: ", error)

      setLoading(false)

      toast({
        title: "Error",
        variant: "destructive",
        description: "Something wrong happened !",
      })
    }
  }

  function computeSessionSlot({
    time,
    date,
    duration,
  }: {
    time: number
    date: Date
    duration: number
  }): SessionSlot {
    const sessionDate = computeTimeAndDateTimestamps(time, date)
    const timeStart = sessionDate.getTime()

    return {
      timeStart,
      timeEnd: timeStart + duration,
    }
  }

  if (loading) {
    return <LoadingScreen message={loadingMessage} />
  }

  if (!searchParams?.mentor || !mentor) {
    return <MentorNotFound />
  }

  if (!!createdSession && confirmedSessionSlot) {
    return (
      <SessionBookedScreen
        mentor={mentor}
        confirmedSessionSlot={confirmedSessionSlot}
      />
    )
  }

  return (
    <>
      <div className="flex glass rounded-md flex-col gap-4 p-8 mt-[8rem] h-fit max-w-[95%] mx-auto w-full">
        <BookSessionHead />
        <div className="flex flex-col md:flex-row gap-8">
          <MentorDetails mentor={mentor} />

          <Card className="flex-1 flex-col items-center justify-center text-white border-stone-800 text-start glass">
            <CardHeader className="flex flex-col items-center gap-8">
              <Stepper
                steps={steps}
                currentStep={bookStep}
                handleStepClick={(step: BookStep) => handleStepClick(step)}
              />
              <Separator className="opacity-30" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              {bookStep === BookStep.SESSION && (
                <SessionEventSelector
                  mentorAddress={mentor.account}
                  selectedMeetingEvent={selectedMeetingEvent}
                  handleSelectEvent={handleSelectEvent}
                />
              )}

              {bookStep === BookStep.SCHEDULE && (
                <SessionCalendar
                  selectedMeetingEvent={selectedMeetingEvent}
                  handleConfirmTimeslot={handleConfirmTimeslot}
                  selectedDate={selectedDate}
                  handleSelectDate={handleSelectDate}
                />
              )}

              {bookStep === BookStep.OBJECTIVES && (
                <SessionGoalInput
                  sessionGoals={sessionGoals}
                  setSessionGoals={setSessionGoals}
                />
              )}

              {bookStep === BookStep.RECAP && confirmedSessionSlot && (
                <SessionRecap
                  confirmedSessionSlot={confirmedSessionSlot}
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
                handleCreateSession={handleCreateSession}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </>
  )
}

function BookSessionHead() {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Book a session</h1>
        <p className="text-dim">
          Pick out the perfect time for your mentoring session
        </p>
      </div>
      <div className="flex items-center self-baseline">
        <NavLinkButton href="/student/mentor-search">
          <IoIosArrowBack />
          Back to search
        </NavLinkButton>
      </div>
    </div>
  )
}
