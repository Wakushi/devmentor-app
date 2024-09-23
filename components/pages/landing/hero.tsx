import TypingAnimation from "@/components/magicui/typing-animation"
import { Button } from "@/components/ui/button"
import GridBackground from "@/components/ui/grid-background"
import Image from "next/image"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function Hero() {
  return (
    <section>
      <GridBackground />
      <div className="min-h-screen flex justify-center items-center">
        <div>
          <h1 className="max-w-2xl mb-4 drop-shadow-lg text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Overcome{" "}
            <span className="text-primary">development challenges</span>,
            accelerate your <span className="text-primary">growth</span>
          </h1>
          <TypingAnimation
            className="max-w-2xl text-start drop-shadow-lg mb-6 font-light lg:mb-8 md:text-lg lg:text-xl"
            text="Connect with mentors who make learning seamless and stress-free for
            budding Web3 enthusiasts!"
            duration={30}
          />
          <div className="flex items-center gap-2">
            <Button className="text-lg px-8 py-6" variant="outline-white">
              Learn more
            </Button>
            <Button className="text-lg px-8 py-6">
              Find a mentor <FaLongArrowAltRight />
            </Button>
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
    </section>
  )
}
