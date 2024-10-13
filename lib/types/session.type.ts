import { Address } from "viem"
import { Mentor, Student } from "./user.type"

export type Session = {
  id?: number
  startTime: number
  endTime: number
  valueLocked: number
  studentAddress: Address
  accepted: boolean
  cancelled?: boolean
  mentor?: Mentor
  student?: Student
  topic: string
  studentContactHash: string
  sessionGoalHash: string
  mentorAddress: Address
  mentorConfirmed: boolean
  studentConfirmed: boolean
}
