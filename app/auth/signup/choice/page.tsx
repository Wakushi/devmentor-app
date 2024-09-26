import AnimatedBackground from "@/components/ui/animated-background"
import Link from "next/link"
import { Users, BookOpen, LucideIcon } from "lucide-react"

export default function ChoicePage() {
  return (
    <>
      <section className="min-h-screen fade-in-bottom flex flex-col gap-8 justify-center items-center text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold">Choose your side</h1>
          <p className="text-xl text-dim">
            Join the community as a mentor or as a student
          </p>
        </div>
        <div className="flex items-center gap-8 w-[800px] h-[350px]">
          <ChoiceCard
            title="Join as a Mentor"
            description="Share your knowledge and experience with eager learners"
            icon={Users}
            link="/auth/signup/mentor"
          />
          <ChoiceCard
            title="Join as a Student"
            description="Learn from experienced mentors and grow your skills"
            icon={BookOpen}
            link="/auth/signup/student"
          />
        </div>
      </section>
      <AnimatedBackground shader={false} />
    </>
  )
}

interface ChoiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  link: string
}

function ChoiceCard({ title, description, icon: Icon, link }: ChoiceCardProps) {
  return (
    <Link
      href={link}
      className="w-full h-full glass rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
    >
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Icon className="w-16 h-16 mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-dim mb-4">{description}</p>
      </div>
    </Link>
  )
}
