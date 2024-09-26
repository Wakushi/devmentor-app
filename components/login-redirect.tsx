"use client"
import { useUser } from "@/services/user.service"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function LoginRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isConnected } = useUser()

  useEffect(() => {
    if (user?.registered || !isConnected) return

    const choice = searchParams.get("role")
    router.push(choice ? `/auth/signup/${choice}` : "/auth/signup/choice")
  }, [])

  return null
}
