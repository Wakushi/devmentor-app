import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon } from "lucide-react"
import { Mentor } from "@/lib/types/user.type"
import { getLanguageOption, LearningField } from "@/lib/types/profile-form.type"
import { CiDollar } from "react-icons/ci"
import { FaLongArrowAltRight } from "react-icons/fa"
import Flag from "@/components/ui/flag"
import { getAverageRating, getInitials } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

  return (
    <Card className="bg-primary-faded rounded-md border border-primary-faded text-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-white cursor-pointer">
      <Link href={`/book-session?mentor=${address}`}>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}`}
                alt={mentor.name}
              />
              <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <div className="flex items-center mt-1">
                <StarIcon className="w-4 h-4 text-primary fill-primary mr-1" />
                <span className="text-sm font-medium">
                  {getAverageRating(reviews)}
                </span>
                <span className="text-sm text-gray-300 ml-1">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap gap-2">
            {languages?.map((lang) => {
              const langOption = getLanguageOption(lang)

              if (!langOption) return null

              return (
                <Flag size="small" key={address + lang} lang={langOption} />
              )
            })}
          </div>

          <div className="flex flex-2 flex-wrap gap-2">
            {learningFields?.map((field: LearningField) => (
              <Badge key={field} variant="secondary" className="text-xs">
                {field.replace("_", " ")}
              </Badge>
            ))}
          </div>

          <div className="flex flex-1 items-center text-sm text-gray-300">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{yearsOfExperience} years of experience</span>
          </div>

          <div className="flex flex-1 items-center text-sm text-gray-300">
            <CiDollar className="w-4 h-4 mr-2" />
            {hourlyRate > 0 ? (
              <span>${hourlyRate}/hour</span>
            ) : (
              <span>Free</span>
            )}
          </div>

          <div>
            <Button>
              Book Session <FaLongArrowAltRight />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
