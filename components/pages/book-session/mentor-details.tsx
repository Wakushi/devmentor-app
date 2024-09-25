import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLanguageOption, LearningField } from "@/lib/types/profile-form.type"
import { getAverageRating, getInitials } from "@/lib/utils"
import { ClockIcon, StarIcon } from "lucide-react"
import { CiDollar } from "react-icons/ci"
import Flag from "@/components/ui/flag"
import { Mentor } from "@/lib/types/user.type"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MentorReviews from "./mentor-reviews"

export default function MentorDetails({ mentor }: { mentor: Mentor }) {
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
    <Card className="flex-1 h-fit max-w-[800px] glass text-white border-none fade-in-left">
      <CardHeader>
        <CardTitle>Ready for Wisdom?</CardTitle>
        <p className="text-dim">
          Here's some details about who you'll be learning from
        </p>
      </CardHeader>
      <CardContent className="flex gap-8">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}`}
                alt={name}
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

          <div className="flex flex-2 flex-wrap gap-2">
            {learningFields?.map((field: LearningField) => (
              <Badge key={field} variant="secondary" className="text-xs">
                {field.replace("_", " ")}
              </Badge>
            ))}
          </div>

          <div className="flex flex-1 flex-wrap gap-2">
            {languages?.map((lang) => {
              const langOption = getLanguageOption(lang)
              if (!langOption) return null
              return <Flag key={address + lang} lang={langOption} />
            })}
          </div>

          <div className="flex flex-1 items-center text-sm text-gray-300">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{yearsOfExperience} years of experience</span>
          </div>

          <div className="flex flex-1 items-center text-sm text-gray-300">
            <CiDollar className="w-4 h-4 mr-2" />
            <span>${hourlyRate}/hour</span>
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto bg-stone-800" />
        <MentorReviews reviews={reviews} />
      </CardContent>
    </Card>
  )
}
