import { Address } from "viem"
import { MentorStruct } from "./user.type"

export type Session = {
  id?: string
  mentorAddress: Address
  studentAddress: Address
  timeStart: number
  valueLocked: number
  objectives: string
  cancelled?: boolean
  mentor?: MentorStruct
}
