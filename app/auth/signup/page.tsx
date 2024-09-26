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

export default function SignUpPage() {
  return (
    <>
      <section className="min-h-screen fade-in-bottom flex flex-col gap-4 justify-center items-center text-center">
        <h1 className="text-5xl">Create an account</h1>
        <p className="text-xl">Start your journey with us!</p>
        <Suspense
          fallback={
            <div className="h-[90] flex justify-center items-center">
              <Loader />
            </div>
          }
        >
          <DynamicConnectors />
        </Suspense>
        <p className="text-small text-dim max-w-[400px]">
          By clicking Sign up, you agree to our terms and conditions and privacy
          policy.
        </p>
        <p className="text-small max-w-[500px]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold hover:underline">
            Log in
          </Link>
        </p>
      </section>
      <AnimatedBackground shader={false} />
    </>
  )
}
