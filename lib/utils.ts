import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { Review } from "./types/review.type"
import { Timeslot } from "./types/timeslot.type"
import { Matcher } from "react-day-picker"

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

export function getAverageRating(reviews: Review[]) {
  const sum = reviews.reduce((acc, review) => acc + review.rate, 0)
  return (sum / reviews.length).toFixed(1)
}

export function getSlotDate(timeslot: Timeslot): Date {
  return new Date(timeslot.date)
}

export function getSlotStartHour(timeslot: Timeslot): string {
  const startTime = new Date(timeslot.startTime)

  const hours = startTime.getHours()
  const minutes = startTime.getMinutes()

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
    year: "numeric",
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

export function getStartTime(timeslot: Timeslot): number {
  const { startTime, date } = timeslot

  const startHours = new Date(startTime).getHours()
  const startDate = new Date(date)
  startDate.setHours(startHours)

  return startDate.getTime()
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
