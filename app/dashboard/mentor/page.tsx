"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
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
import { pinMentorTimeslots } from "@/lib/actions/client/pinata-actions"
import { updateTimeslot } from "@/lib/actions/web3/contract"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: MentorStruct
    loadingUser: boolean
  }

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  async function handleSaveTimeslots(timeslots: Timeslot[]): Promise<void> {
    const timeslotsHash = await pinMentorTimeslots(user, timeslots)
    await updateTimeslot(user.account, timeslotsHash)
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
          <DialogContent>
            <DialogTitle>My availabilities</DialogTitle>
            <AvailabilityPicker
              mentor={user as MentorStruct}
              handleSaveTimeslots={handleSaveTimeslots}
            />
          </DialogContent>
        </Dialog>
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
