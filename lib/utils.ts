import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { Review } from "./types/review.type"
import { DayOfWeek, DaySlot, Timeslot } from "./types/timeslot.type"
import { Matcher } from "react-day-picker"
import { NINETY_DAYS, ONE_HOUR_IN_MS } from "./constants"

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

export function getStartTime(timeslot: Timeslot): number {
  const { timeStart, date } = timeslot

  const startHours = new Date(timeStart).getHours()
  const startDate = new Date(date)
  startDate.setHours(startHours)

  return startDate.getTime()
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

export function computeTimeslots(
  daysOfWeek: DayOfWeek[],
  mentorAddress: Address
): Timeslot[] {
  const activeDays = daysOfWeek.filter((day) => day.active)
  const hourlySlotsByDay: Map<number, DaySlot[]> = new Map()

  const isSameSlot = (slotA: DaySlot, slotB: DaySlot): boolean => {
    return (
      slotA.timeStart === slotB.timeStart && slotA.timeEnd === slotB.timeEnd
    )
  }

  activeDays.forEach((day) => {
    const savedDaySlots: DaySlot[] = []

    day.slots.forEach((slot) => {
      // Initially, the day slots produced by the DayOfWeekCard component have:
      // - a timeStart to represents when the first slot of the day begins
      // - a timeEnd to represent when the last slot of the day ends

      // To have time slots divided by hour, we need to transform these into hourly divided
      // slots so that reelAmountOfSlots = (timeEnd - timeStart) / 1h

      const { timeStart, timeEnd } = slot
      const durationInHours = Math.floor((timeEnd - timeStart) / ONE_HOUR_IN_MS)

      for (let i = 0; i < durationInHours; i++) {
        const startTimeDate = new Date(timeStart + ONE_HOUR_IN_MS * i)
        const endTimeDate = new Date(timeStart + ONE_HOUR_IN_MS * (i + 1))

        const newSlot = {
          timeStart: startTimeDate.getTime(),
          timeEnd: endTimeDate.getTime(),
          dayOfWeek: day.index,
        }

        if (savedDaySlots.some((daySlot) => isSameSlot(daySlot, newSlot)))
          continue

        savedDaySlots.push({
          timeStart: startTimeDate.getTime(),
          timeEnd: endTimeDate.getTime(),
          dayOfWeek: day.index,
        })
      }
    })

    hourlySlotsByDay.set(day.index, savedDaySlots)
  })

  const timeslots: Timeslot[] = []
  const today = new Date()

  for (let i = 0; i < NINETY_DAYS; i++) {
    const slotDate = new Date(today)

    slotDate.setDate(today.getDate() + i)
    slotDate.setHours(0, 0, 0, 0)

    const slotDateDay = slotDate.getDay()

    if (!hourlySlotsByDay.has(slotDateDay)) continue

    const slots = hourlySlotsByDay.get(slotDateDay)

    if (!slots || !slots.length) continue

    slots.forEach(({ timeStart, timeEnd }) => {
      timeslots.push({
        mentorAddress,
        date: slotDate.getTime(),
        timeStart,
        timeEnd,
        isBooked: false,
      })
    })
  }

  return timeslots
}

export function hashCode(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

export function getTimeslotId(slot: Timeslot): number {
  const { mentorAddress, date, timeStart, timeEnd } = slot
  const concatenatedString = `${mentorAddress}${date}${timeStart}${timeEnd}`
  return hashCode(concatenatedString)
}
