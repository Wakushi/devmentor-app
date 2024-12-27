import { Role } from "./role.type"
import { Address } from "viem"

export type FirebaseUser = {
  address: Address
  timezone: string
}

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

export type Mentor = {
  account: Address
  baseUser: BaseUser
  validated: boolean
  yearsOfExperience: number
  sessionCount: number
  totalRating: number
  hourlyRate: number
  role: Role
}

// Raw structs received from the contract
export type ContractBaseUser = [
  Address, // account
  string, // userName
  bigint[], // languagesRaw
  bigint[] // subjectsRaw
]

export type ContractStudent = [
  ContractBaseUser,
  string, // contactHash
  bigint // experience
]

export type ContractMentor = [
  ContractBaseUser,
  boolean, // validated
  bigint, // yearsOfExperience
  bigint, // sessionCount
  bigint, // hourlyRate
  bigint // totalRating;
]
