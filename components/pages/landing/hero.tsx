"use client"

import TypingAnimation from "@/components/magicui/typing-animation"
import AnimatedBackground from "@/components/ui/animated-background"
import NavLinkButton from "@/components/ui/nav-link"
import { Role } from "@/lib/types/role.type"
import { useUser } from "@/services/user.service"
import Image from "next/image"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function Hero() {
  const { user } = useUser()

  const mentorLink = (): string => {
    let url = "/auth/signup?role=mentor"

    if (user?.role === Role.MENTOR) {
      url = "/dashboard/mentor"
    }

    return url
  }

  const studentLink = (): string => {
    let url = "/auth/signup?role=student"

    if (user?.role === Role.MENTOR) {
      url = "/dashboard/mentor"
    }

    if (user?.role === Role.STUDENT) {
      url = "/mentor-search"
    }

    return url
  }

  return (
    <section className="relative">
      <div className="min-h-screen flex gap-4 justify-center items-center">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="max-w-2xl mb-4 drop-shadow-lg text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Overcome{" "}
              <span className="text-primary">development challenges</span>,
              learn from the <span className="text-primary">best</span>
            </h1>
            <TypingAnimation
              className="max-w-2xl h-[56px] text-start drop-shadow-lg mb-6 font-light lg:mb-8 md:text-lg lg:text-xl"
              text="Connect with mentors who make learning seamless and stress-free for
            budding Web3 enthusiasts!"
              duration={20}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[180px]">
              <NavLinkButton variant="outline" href={mentorLink()}>
                Become a mentor
              </NavLinkButton>
            </div>
            <div className="h-[40px] w-[180px]">
              <NavLinkButton variant="filled" href={studentLink()}>
                Find a mentor <FaLongArrowAltRight />
              </NavLinkButton>
            </div>
          </div>
        </div>
        <div>
          <Image
            width={368}
            height={285}
            className="max-h-[285px]"
            src="/assets/hero-image.png"
            alt="mockup"
          />
        </div>
      </div>
      <AnimatedBackground />
    </section>
  )
}
