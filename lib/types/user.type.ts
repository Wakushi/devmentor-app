import { Review } from "./review.type"
import { Role } from "./role.type"
import { Address } from "viem"

export type BaseUser = {
  account: Address
  userName: string
  languages: number[]
  subjects: number[]
}

export type Visitor = {
  account: Address
  role: Role
}

export type Student = {
  account: Address
  baseUser: BaseUser
  contactHash: string
  experience: number
  role: Role
}

export type MentorStruct = {
  account: Address
  baseUser: BaseUser
  validated: boolean
  yearsOfExperience: number
  sessionCount: number
  hourlyRate: number
  timeslotsHash: string
  reviewsHash: string
  role: Role
  reviews: Review[]
}

// Raw structs received from the contract
export type RawBaseUser = [
  Address, // account
  string, // userName
  bigint[], // languagesRaw
  bigint[] // subjectsRaw
]

export type RawStudent = [
  RawBaseUser,
  string, // contactHash
  bigint // experience
]

export type RawMentor = [
  RawBaseUser,
  boolean, // validated
  bigint, // yearsOfExperience
  bigint, // sessionCount
  bigint, // hourlyRate
  string, // timeslotsHash
  string // reviewsHash
]
