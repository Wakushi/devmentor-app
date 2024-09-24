"use client"
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
import { Mentor } from "@/lib/types/user.type"
import { languageOptions } from "@/lib/types/profile-form.type"
import { capitalizeFirstLetter } from "@/lib/utils"

interface FiltersProps {
  filters: {
    expertise: string
    language: string
    maxHourlyRate: string
    freeSessionsOnly: boolean
  }
  onFilterChange: (filterName: string, value: string | boolean) => void
  mentors: Mentor[]
}

export default function Filters({
  filters,
  onFilterChange,
  mentors,
}: FiltersProps) {
  const uniqueExpertise = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.learningFields || []))
  )
  const uniqueLanguages = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.languages || []))
  )
  const maxRate = Math.max(...mentors.map((mentor) => mentor.hourlyRate))

  function getLanguageLabel(language: string): string {
    const lang = languageOptions.find((l) => l.value === language)
    return lang?.label ?? language
  }

  return (
    <Card className="w-full flex-1 glass text-white">
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
