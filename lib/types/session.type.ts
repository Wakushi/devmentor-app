import { Address } from "viem"
import { Mentor, Student } from "./user.type"

export type Session = {
  startTime: number
  endTime: number
  studentAddress: Address
  valueLocked: number
  objectives: string
  accepted: boolean
  cancelled?: boolean
  mentor?: Mentor
  student?: Student
  studentContactHash: string
  mentorAddress: Address
  mentorConfirmed: boolean
  studentConfirmed: boolean
}
