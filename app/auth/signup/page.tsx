import AnimatedBackground from "@/components/ui/animated-background"

export default function SignUpPage() {
  return (
    <>
      <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
        <h1>Create an account</h1>
        <p>Start your journey with us!</p>
        <div></div>
        <p className="text-small text-dim max-w-[500px]">
          By clicking Sign up with GitHub, Sign up with Google and Connect
          Wallet, you agree to our terms and conditions and privacy policy.
        </p>
        <p className="text-small max-w-[500px]">
          Already have an account? <span className="font-bold">Log in</span>
        </p>
      </section>
      <AnimatedBackground />
    </>
  )
}
