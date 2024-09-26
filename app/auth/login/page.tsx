import AnimatedBackground from "@/components/ui/animated-background"
import Loader from "@/components/ui/loader"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Suspense } from "react"

const DynamicConnectors = dynamic(
  () => import("@/components/pages/auth/connectors"),
  {
    ssr: false,
  }
)

export default function LoginPage() {
  return (
    <>
      <section className="min-h-screen fade-in-bottom flex flex-col gap-4 justify-center items-center text-center">
        <h1 className="text-5xl">Log in to your account</h1>
        <p className="text-xl">Welcome back! Please enter your details.</p>
        <Suspense
          fallback={
            <div className="h-[90px] flex justify-center items-center">
              <Loader />
            </div>
          }
        >
          <DynamicConnectors />
        </Suspense>
        <p className="text-small max-w-[500px]">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </section>
      <AnimatedBackground shader={false} />
    </>
  )
}
