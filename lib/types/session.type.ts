import { Address } from "viem"
import { Mentor } from "./user.type"

export type Session = {
  id?: string
  mentorAddress: Address
  studentAddress: Address
  startTime: number
  valueLocked: number
  objectives: string
  cancelled?: boolean
  mentor?: Mentor
}
