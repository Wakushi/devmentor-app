"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import Loader from "@/components/ui/loader"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const DynamicConnectors = dynamic(
  () => import("@/components/pages/auth/connectors"),
  {
    ssr: false,
  }
)

export default function SignUpPage() {
  return (
    <>
      <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
        <h1 className="text-5xl">Create an account</h1>
        <p className="text-xl">Start your journey with us!</p>
        <Suspense fallback={<Loader />}>
          <DynamicConnectors />
        </Suspense>
        <p className="text-small text-dim max-w-[500px]">
          By clicking Sign up with Web3Auth or Sign up with Metamask, you agree
          to our terms and conditions and privacy policy.
        </p>
        <p className="text-small max-w-[500px]">
          Already have an account? <span className="font-bold">Log in</span>
        </p>
      </section>
      <AnimatedBackground />
    </>
  )
}
