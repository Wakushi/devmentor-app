"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { Mentor } from "@/lib/types/user.type"
import { useUser } from "@/stores/user.store"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function DashboardPage() {
  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-[8rem] min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user.baseUser.userName} !
      </h1>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-[200px]">
          <NavLinkButton variant="filled" href="/mentor/availability">
            My availabilities <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <PlannedSessions />
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
