"use client"

import { MeetingEvents } from "@/components/pages/dashboard/mentor/meeting-events"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { Mentor } from "@/lib/types/user.type"

export default function AvailabilityPage() {
  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-40 pb-8 min-h-screen m-auto w-[90%]">
      <div className="flex w-full gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl">Availabilities</h2>
            <p className="text-small font-normal font-sans text-dim">
              Update your availabilities
            </p>
          </div>
          <AvailabilityPicker mentor={user} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl">Events</h2>
            <p className="text-small font-normal font-sans text-dim">
              Manage your events
            </p>
          </div>
          <MeetingEvents mentor={user} />
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
