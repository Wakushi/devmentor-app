import React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon } from "lucide-react"
import { Mentor } from "@/lib/types/user.type"
import { LearningField } from "@/lib/types/profile-form.type"
import { CiDollar } from "react-icons/ci"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function MentorCard({ mentor }: { mentor: Mentor }) {
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
    <Card className="glass text-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${mentor.name}`}
              alt={mentor.name}
            />
            <AvatarFallback>{getInitials(mentor.name || "")}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <div className="flex items-center mt-1">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {getAverageRating(mentor.reviews)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({mentor.reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap gap-2 mb-3">
          {mentor.learningFields?.map((field: LearningField) => (
            <Badge key={field} variant="secondary" className="text-xs">
              {field.replace("_", " ")}
            </Badge>
          ))}
        </div>

        <div className="flex flex-1 items-center text-sm text-gray-500 mb-2">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>{mentor.yearsOfExperience} years of experience</span>
        </div>

        <div className="flex flex-1 items-center text-sm text-gray-500">
          <CiDollar className="w-4 h-4 mr-2" />
          <span>${mentor.hourlyRate}/hour</span>
        </div>

        <Button>
          Book Session <FaLongArrowAltRight />
        </Button>
      </CardContent>
    </Card>
  )
}
