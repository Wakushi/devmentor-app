"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
import LoadingScreen from "@/components/ui/loading-screen"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { MentorStruct } from "@/lib/types/user.type"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: MentorStruct | null
    loadingUser: boolean
  }

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user.baseUser.userName} !
      </h1>
      <div className="flex items-center gap-8">
        <PlannedSessions />
        <AvailabilityPicker mentor={user as MentorStruct} />
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
