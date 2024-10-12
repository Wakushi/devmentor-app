import { Address } from "viem"
import { Mentor, Student } from "./user.type"

export type Session = {
  startTime: number
  endTime: number
  valueLocked: number
  studentAddress: Address
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
