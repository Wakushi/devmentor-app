import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { Timeslot } from "./types/timeslot.type"
import { Matcher } from "react-day-picker"
import {
  allLanguages,
  allSubjects,
  Language,
  LearningField,
} from "./types/profile-form.type"
import { TimeValue } from "react-aria"
import { Mentor } from "./types/user.type"

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

export function getSlotDate(timeslot: Timeslot): Date {
  return new Date(getTimeslotStartTime(timeslot))
}

export function getSlotStartHour(timeslot: Timeslot): string {
  const timeStart = new Date(timeslot.timeStart)

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
    day.setHours(0, 0, 0, 0)

    return !timeslotsPool.some((slot) => {
      const timeslotDate = getSlotDate(slot)
      timeslotDate.setHours(0, 0, 0, 0)
      return timeslotDate.getTime() === day.getTime()
    })
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

export function getTimeslotStartTime(timeslot: Timeslot): number {
  const { timeStart, day } = timeslot
  return computeTimeAndDateTimestamps(timeStart, day).getTime()
}

export function getTimeslotEndTime(timeslot: Timeslot): number {
  const { timeEnd, day } = timeslot
  return computeTimeAndDateTimestamps(timeEnd, day).getTime()
}

export function computeTimeAndDateTimestamps(time: number, day: number): Date {
  const timeAsDate = new Date(time)

  const hours = timeAsDate.getHours()
  const minutes = timeAsDate.getMinutes()

  const completeDate = new Date()

  completeDate.setDate(day)
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

export function getTimeslotId(slot: Timeslot): number {
  const { mentorAddress, day, timeStart, timeEnd } = slot
  const concatenatedString = `${mentorAddress}${day}${timeStart}${timeEnd}`
  return hashCode(concatenatedString)
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
