"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { MentorStruct } from "@/lib/types/user.type"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CiCalendar } from "react-icons/ci"
import { Timeslot } from "@/lib/types/timeslot.type"
import useTimeslotsQuery from "@/hooks/queries/timeslots-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { useQueryClient } from "@tanstack/react-query"
import {
  getTimeslotsByAddress,
  updateTimeslot,
  updateTimeslots,
} from "@/services/user.service"

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { user, loadingUser } = useUser() as {
    user: MentorStruct
    loadingUser: boolean
  }
  const timeslotsQuery = useTimeslotsQuery(user?.account)
  const { data: timeslots } = timeslotsQuery

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  async function handleSaveAvailabilities(
    availabilities: Timeslot[]
  ): Promise<void> {
    await updateTimeslots(availabilities)

    queryClient.invalidateQueries({
      queryKey: [QueryKeys.TIMESLOTS, user.account],
    })
  }

  async function getTimeslots() {
    const timelots = await getTimeslotsByAddress(user.account)
    console.log("timelots: ", timelots)
  }

  async function updateTimeslotById() {
    const timelots = await getTimeslotsByAddress(user.account)
    const timeslotIndex = 1

    const timeslot = { ...timelots[timeslotIndex], isBooked: true }

    await updateTimeslot({
      timeslot,
      timeslotId: timeslotIndex,
      mentorAddress: user.account,
    })
  }

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user.baseUser.userName} !
      </h1>
      <div className="flex items-center gap-8">
        <PlannedSessions />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CiCalendar />
              My availabilities
            </Button>
          </DialogTrigger>
          <DialogContent className="border-transparent">
            <DialogTitle>
              <span className="text-2xl">Availabilities</span>
              <p className="text-small font-normal font-sans text-dim">
                Update your availabilities
              </p>
            </DialogTitle>
            <AvailabilityPicker
              mentor={user as MentorStruct}
              timeslots={timeslots ?? []}
              handleSaveAvailabilities={handleSaveAvailabilities}
            />
          </DialogContent>
        </Dialog>
        <Button onClick={() => getTimeslots()}>Check</Button>
        <Button onClick={() => updateTimeslotById()}>Update</Button>
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}

function PlannedSessions() {
  return (
    <section>
      <p>No sessions planned yet.</p>
    </section>
  )
}
