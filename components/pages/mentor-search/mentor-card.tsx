import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon } from "lucide-react"
import { Mentor } from "@/lib/types/user.type"
import {
  allSubjects,
  getLanguageOption,
  LearningField,
} from "@/lib/types/profile-form.type"
import { FaLongArrowAltRight } from "react-icons/fa"
import Flag from "@/components/ui/flag"
import { getAverageRating, getInitials } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import HourlyRate from "@/components/hourly-rate"

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  const { baseUser, reviews, yearsOfExperience, hourlyRate, account } = mentor
  const { userName, languages, subjects } = baseUser
  const learningFields = subjects.map((subject) => allSubjects[subject])

  return (
    <Card className="bg-primary-faded rounded-md border border-primary-faded text-white overflow-hidden transition-all duration-300 hover:border-white cursor-pointer hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/book-session?mentor=${account}`}>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userName}`}
                alt={userName}
              />
              <AvatarFallback>{getInitials(userName || "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{userName}</p>
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
                <Flag size="small" key={account + lang} lang={langOption} />
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
            <HourlyRate hourlyRate={hourlyRate} />
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

export function MentorCardSkeleton() {
  return (
    <div className="bg-primary-faded flex items-center justify-between border border-primary-faded text-white rounded-md px-4 py-2 min-h-[88px] min-w-[450px]">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-dim bg-opacity-15" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-dim bg-opacity-15" />
          <Skeleton className="h-4 w-[200px] bg-dim bg-opacity-15" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-[100px] bg-dim bg-opacity-15" />
        <Skeleton className="h-4 w-[100px] bg-dim bg-opacity-15" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-[100px] bg-dim bg-opacity-15" />
        <Skeleton className="h-4 w-[100px] bg-dim bg-opacity-15" />
      </div>
      <div>
        <Skeleton className="h-6 w-[200px] bg-dim bg-opacity-15" />
      </div>
    </div>
  )
}
