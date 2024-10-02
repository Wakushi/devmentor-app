"use client"
import React, { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MentorStruct } from "@/lib/types/user.type"
import { languageOptions } from "@/lib/types/profile-form.type"
import {
  capitalizeFirstLetter,
  getLanguagesFromIds,
  getSubjectsFromIds,
} from "@/lib/utils"
import { Star } from "lucide-react"

interface FiltersProps {
  filters: {
    expertise: string
    language: string
    maxHourlyRate: string
    freeSessionsOnly: boolean
    minRating: number
  }
  onFilterChange: (filterName: string, value: string | boolean | number) => void
  mentors: MentorStruct[]
}

export default function Filters({
  filters,
  onFilterChange,
  mentors,
}: FiltersProps) {
  const uniqueExpertise = Array.from(
    new Set(
      mentors.flatMap(
        (mentor) => getSubjectsFromIds(mentor.baseUser.subjects) || []
      )
    )
  )

  const uniqueLanguages = Array.from(
    new Set(
      mentors.flatMap(
        (mentor) => getLanguagesFromIds(mentor.baseUser.languages) || []
      )
    )
  )

  const maxRate = mentors.length
    ? Math.max(...mentors.map((mentor) => mentor.hourlyRate))
    : 0

  function getLanguageLabel(language: string): string {
    const lang = languageOptions.find((l) => l.value === language)
    return lang?.label ?? language
  }

  return (
    <Card className="w-full flex-1 glass text-white min-w-[300px] border-stone-800 rounded-md fade-in-left">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expertise">Expertise</Label>
          <Select
            value={filters.expertise}
            onValueChange={(value) => onFilterChange("expertise", value)}
          >
            <SelectTrigger id="expertise">
              <SelectValue placeholder="Select expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueExpertise.map((field) => (
                <SelectItem key={field} value={field}>
                  {capitalizeFirstLetter(field.replace("_", " ").toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={filters.language}
            onValueChange={(value) => onFilterChange("language", value)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxHourlyRate">
            Max Hourly Rate: ${filters.maxHourlyRate || maxRate}
          </Label>
          <Slider
            id="maxHourlyRate"
            min={0}
            max={maxRate}
            step={1}
            value={[parseInt(filters.maxHourlyRate) || maxRate]}
            onValueChange={(value) =>
              onFilterChange("maxHourlyRate", value[0].toString())
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRating">Min Rating</Label>
          <StarRating
            rating={filters.minRating}
            onRatingChange={(rating) => onFilterChange("minRating", rating)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="freeSessionsOnly"
            checked={filters.freeSessionsOnly}
            onCheckedChange={(checked) =>
              onFilterChange("freeSessionsOnly", checked as boolean)
            }
          />
          <Label htmlFor="freeSessionsOnly">Free sessions only</Label>
        </div>
      </CardContent>
    </Card>
  )
}

function StarRating({
  rating,
  onRatingChange,
}: {
  rating: number
  onRatingChange: (rating: number) => void
}) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors duration-150 ${
            star <= (hoverRating || rating)
              ? "text-primary fill-primary"
              : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  )
}
