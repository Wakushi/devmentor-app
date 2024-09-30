import { Address } from "viem"

export type Timeslot = {
  id?: string
  mentorAddress: Address
  date: number
  timeStart: number
  timeEnd: number
  isBooked: boolean
  studentId?: string
}

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
