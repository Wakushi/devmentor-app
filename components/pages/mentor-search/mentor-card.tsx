import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon } from "lucide-react"
import { Mentor } from "@/lib/types/user.type"
import { getLanguageOption, LearningField } from "@/lib/types/profile-form.type"
import { CiDollar } from "react-icons/ci"
import { FaLongArrowAltRight } from "react-icons/fa"
import NavLinkButton from "@/components/ui/nav-link"
import Flag from "@/components/ui/flag"

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  const {
    name,
    reviews,
    learningFields,
    languages,
    yearsOfExperience,
    hourlyRate,
    address,
  } = mentor

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAverageRating = (reviews: { rate: number }[]) => {
    const sum = reviews.reduce((acc, review) => acc + review.rate, 0)
    return (sum / reviews.length).toFixed(1)
  }

  return (
    <Card className="glass text-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-accent">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
              alt={mentor.name}
            />
            <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{name}</p>
            <div className="flex items-center mt-1">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {getAverageRating(reviews)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap gap-2 mb-3">
          {languages?.map((lang) => {
            const langOption = getLanguageOption(lang)

            if (!langOption) return null

            return <Flag key={address + lang} lang={langOption} />
          })}
        </div>

        <div className="flex flex-2 flex-wrap gap-2 mb-3">
          {learningFields?.map((field: LearningField) => (
            <Badge key={field} variant="secondary" className="text-xs">
              {field.replace("_", " ")}
            </Badge>
          ))}
        </div>

        <div className="flex flex-1 items-center text-sm text-gray-500 mb-2">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>{yearsOfExperience} years of experience</span>
        </div>

        <div className="flex flex-1 items-center text-sm text-gray-500">
          <CiDollar className="w-4 h-4 mr-2" />
          <span>${hourlyRate}/hour</span>
        </div>

        <div>
          <NavLinkButton
            variant="filled"
            href={`/book-session?mentor=${address}`}
          >
            Book Session <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      </CardContent>
    </Card>
  )
}
