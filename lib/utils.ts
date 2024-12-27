import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { DaySlot, Timeslot } from "./types/timeslot.type"
import { Matcher } from "react-day-picker"
import {
  allLanguages,
  allSubjects,
  Language,
  LearningField,
} from "./types/profile-form.type"
import { TimeValue } from "react-aria"
import { Mentor } from "./types/user.type"
import { getTimezoneByLabel, Timezone } from "./timezones"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: Address): string {
  if (!address) {
    throw new Error("Invalid address")
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function getAverageRating(mentor: Mentor) {
  const { sessionCount, totalRating } = mentor

  if (!sessionCount || !totalRating) return 0

  return totalRating / sessionCount
}

export function getSlotStartHour(slot: number): string {
  const timeStart = new Date(slot)

  const hours = timeStart.getHours()
  const minutes = timeStart.getMinutes()

  const period = hours >= 12 ? "pm" : "am"
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, "0")}${period}`
}

export function getTimeslotMatcher(
  timeslotsPool: Timeslot[]
): (date: Date) => boolean {
  const timeslotMatcher: Matcher = (day: Date) => {
    const now = Date.now()
    const matchesDay = !timeslotsPool.some((slot) => {
      const futureDate = day.getTime() >= now
      return slot.day === day.getDay() && futureDate
    })

    return matchesDay
  }

  return timeslotMatcher
}

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function timeValueToTimestamp(timeValue: TimeValue): number {
  if (!timeValue) return 0

  const { hour, minute } = timeValue
  const date = new Date()

  date.setHours(hour)
  date.setMinutes(minute)

  return date.getTime()
}

export function getDefaultSlot(): DaySlot {
  const date = new Date()
  date.setMinutes(0)

  date.setHours(9)
  const timeStart = date.getTime()

  date.setHours(17)
  const timeEnd = date.getTime()

  const defaultSlot: DaySlot = {
    timeStart,
    timeEnd,
  }

  return defaultSlot
}

export function computeTimeAndDateTimestamps(time: number, date: Date): Date {
  const timeAsDate = new Date(time)
  const completeDate = new Date(date)

  const hours = timeAsDate.getHours()
  const minutes = timeAsDate.getMinutes()

  completeDate.setHours(hours)
  completeDate.setMinutes(minutes)

  return completeDate
}

export function getWeekdayName(
  dayIndex: number,
  locale: string = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    new Date(2017, 0, dayIndex + 1)
  )
}

export function createGoogleCalendarLink(event: {
  title: string
  startDate: Date
  endDate: Date
  description?: string
}): string {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE"

  const dateFormat = (date: Date): string =>
    date.toISOString().replace(/-|:|\.\d\d\d/g, "")

  const params = new URLSearchParams({
    text: event.title,
    dates: `${dateFormat(event.startDate)}/${dateFormat(event.endDate)}`,
    details: event.description || "",
  })

  return `${baseUrl}&${params.toString()}`
}

export function hashCode(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

export function getSubjectsFromIds(subjectsIds: number[]): LearningField[] {
  return subjectsIds.map((subjectId) => allSubjects[subjectId])
}

export function getLanguagesFromIds(langIds: number[]): Language[] {
  return langIds.map((langId) => allLanguages[langId])
}

export function msToReadableDuration(durationInMs: number): string {
  if (!durationInMs) return "0min"

  let duration = ""

  const seconds = durationInMs / 1000
  let minutes = seconds ? seconds / 60 : 0
  let hours = minutes ? Math.floor(minutes / 60) : 0

  minutes = Math.floor(minutes % 60)

  duration += hours ? hours.toString() + "h" : ""
  duration += minutes ? minutes.toString() + "min" : ""

  return duration
}

export function timeStampToTimeValue(timestamp: number): TimeValue {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minute = date.getMinutes()

  return {
    hour,
    minute,
  } as TimeValue
}

export function getTimeZone(): Timezone {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const timezone = getTimezoneByLabel(userTimezone)

  return timezone
    ? timezone
    : {
        label: "Europe/London",
        value: "UTC+00:00",
        description: "London, Dublin, Lisbon",
      }
}
