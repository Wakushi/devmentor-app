import { Address } from "viem"
import { Mentor } from "./user.type"

export type Session = {
  id?: string
  mentorAddress: Address
  studentAddress: Address
  startTime: number
  valueLocked: number
  cancelled?: boolean
  mentor?: Mentor
}
