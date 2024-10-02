import { Address } from "viem"
import { MentorStruct } from "./user.type"

export type Session = {
  mentorAddress: Address
  studentAddress: Address
  startTime: number
  endTime: number
  valueLocked: number
  objectives: string
  cancelled?: boolean
  mentor?: MentorStruct
  studentContactHash: string
  mentorConfirmed: boolean
  studentConfirmed: boolean
}
