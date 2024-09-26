"use client"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
import LoadingScreen from "@/components/ui/loading-screen"

export default function DashboardPage() {
  const { user, loadingUser } = useUser()

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name} !</h1>
      <AnimatedBackground shader={false} />
    </div>
  )
}
