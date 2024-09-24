import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"
import {
  ContactType,
  Experience,
  Language,
  LearningField,
} from "./profile-form.type"
import { Role } from "./role.type"

type Contact = {
  type: ContactType
  value: string
}

export type User = {
  id?: string
  address: `0x${string}`
  name?: string
  email?: string
  registered?: boolean
  role?: Role
  languages?: Language[]
  experience?: Experience
  learningFields?: LearningField[]
  contacts?: Contact[]
  web3AuthData?: Partial<OpenloginUserInfo>
}
