import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"
import {
  ContactType,
  Experience,
  Language,
  LearningField,
} from "./profile-form.type"
import { Role } from "./role.type"
import { Review } from "./review.type"

type Contact = {
  type: ContactType
  value: string
}

export type User = {
  id?: string
  address: `0x${string}`
  name?: string
  registered?: boolean
  role?: Role
  languages?: Language[]
  learningFields?: LearningField[]
  web3AuthData?: Partial<OpenloginUserInfo> | null
}

export type Student = User & {
  experience?: Experience
  contacts?: Contact[]
}

export type Mentor = User & {
  validated: boolean
  yearsOfExperience: number
  reviews: Review[]
  sessionCount: number
  hourlyRate: number
  timeslotsHash?: string
}
