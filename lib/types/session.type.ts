import { Address } from "viem"
import { Mentor } from "./user.type"

export type Session = {
  mentorAddress: Address
  studentAddress: Address
  startTime: number
  endTime: number
  valueLocked: number
  objectives: string
  cancelled?: boolean
  mentor?: Mentor
  studentContactHash: string
  mentorConfirmed: boolean
  studentConfirmed: boolean
}
