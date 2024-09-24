"use client"

import { FaLongArrowAltLeft } from "react-icons/fa"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { getLanguageOption, LearningField } from "@/lib/types/profile-form.type"
import { getAverageRating, getInitials } from "@/lib/utils"
import { ClockIcon, StarIcon } from "lucide-react"
import { CiDollar } from "react-icons/ci"
import Flag from "@/components/ui/flag"
import AnimatedBackground from "@/components/ui/animated-background"
import { Mentor } from "@/lib/types/user.type"
import { Review } from "@/lib/types/review.type"

export default function BookSessionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const mentor = MENTORS_MOCK.find((m) => m.address === searchParams?.mentor)

  if (!searchParams?.mentor || !mentor) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-4 min-h-screen">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Mentor not found</h3>
          <p className="text-gray-600">
            Sorry, but we couldn't find your mentor.
          </p>
        </div>
        <Button variant="default" asChild>
          <a href="/mentor-search" className="flex items-center gap-2">
            <FaLongArrowAltLeft /> Back to mentor list
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-40 min-h-screen max-w-[90%] mx-auto w-full">
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-2">Book a session</h1>
        <p className="text-gray-600">
          Pick out the perfect time for your mentoring session
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <MentorDetails mentor={mentor} />

        <Card className="flex-1 glass text-white">
          <CardHeader>
            <CardTitle>Select Date and Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={new Date()}
              onSelect={() => {}}
              className="rounded-md border mb-4"
            />
            <div>
              <h3 className="font-semibold mb-2">Available Time Slots</h3>
              {/* Add time slot selection here */}
              <p className="text-gray-600">
                Please select a date to see available time slots.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}

function MentorDetails({ mentor }: { mentor: Mentor }) {
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
    <Card className="flex-1 h-fit glass text-white">
      <CardHeader>
        <CardTitle>Mentor Details</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
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
        <MentorReviews reviews={reviews} />
      </CardContent>
    </Card>
  )
}

function MentorReviews({ reviews }: { reviews: Review[] }) {
  const lastTwoReviews = reviews.slice(-2).reverse()

  return (
    <div className="flex-2">
      <h3 className="text-lg font-semibold mb-2">Latest Reviews</h3>
      {lastTwoReviews.length > 0 ? (
        lastTwoReviews.map((review, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 rounded-lg p-3 mb-2"
          >
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rate
                      ? "text-primary fill-primary"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-200">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No reviews yet.</p>
      )}
    </div>
  )
}
