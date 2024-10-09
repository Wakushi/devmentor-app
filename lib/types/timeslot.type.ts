import { Address } from "viem"

export type DaySlot = {
  timeStart: number
  timeEnd: number
  dayOfWeek?: number
}

export type DayOfWeek = {
  index: number
  name: string
  slots: DaySlot[]
  active: boolean
}

export type MeetingEvent = {
  id?: string
  mentorAddress: Address
  name: string
  duration: number
  description?: string
  timeslots: Timeslot[]
}

export type Timeslot = {
  id?: string
  mentorAddress: Address
  day: number
  timeStart: number
  timeEnd: number
}
