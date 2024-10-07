import {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { createUserJwtToken, getRequestUser } from "@/lib/crypto/jwt"
import { Role } from "@/lib/types/role.type"
import {
  BaseUser,
  MentorStruct,
  RawMentor,
  RawStudent,
  Student,
  Visitor,
} from "@/lib/types/user.type"
import { getMentorReviews } from "@/services/ipfs.service"
import { ethers } from "ethers"
import { NextRequest, NextResponse } from "next/server"
import { Address } from "viem"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address") as Address

  const contract = getContract()

  try {
    if (!address) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      )
    }

    const roles = [Role.VISITOR, Role.MENTOR, Role.STUDENT]
    const rawRole: bigint = await contract.getRoleByAccount(address)
    const role = roles[Number(rawRole)]

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    let user: Visitor | Student | MentorStruct

    switch (role) {
      case Role.VISITOR:
        user = { account: address, role: Role.VISITOR } as Visitor
        break
      case Role.STUDENT:
        user = (await buildUser(
          await contract.getStudent(address),
          Role.STUDENT
        )) as Student
        break
      case Role.MENTOR:
        user = (await buildUser(
          await contract.getMentor(address),
          Role.MENTOR
        )) as MentorStruct
        break
    }

    const token = await createUserJwtToken({
      address: user.account,
      role,
    })

    const response = NextResponse.json({ user })

    response.cookies.set({
      name: process.env.NEXT_PUBLIC_TOKEN_COOKIE as string,
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userPayload, role } = await req.json()

    const user = await getRequestUser(req)

    if (!user || !user.address) {
      return NextResponse.json({ error: "Unidentified user" }, { status: 400 })
    }

    if (user.role !== Role.VISITOR) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = await createUserJwtToken({
      address: user.address,
      role,
    })

    const response = NextResponse.json({ userPayload })

    response.cookies.set({
      name: process.env.NEXT_PUBLIC_TOKEN_COOKIE as string,
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 })
  }
}

// When we make a call using ethers, we need to properly format the received data
async function buildUser(
  rawUser: RawStudent | RawMentor,
  role: Role
): Promise<Student | MentorStruct> {
  const [baseUserRaw] = rawUser
  const [account, userName, languagesRaw, subjectsRaw] = baseUserRaw

  const baseUser: BaseUser = {
    account,
    userName,
    languages: languagesRaw.map((l: bigint) => Number(l)),
    subjects: subjectsRaw.map((l: bigint) => Number(l)),
  }

  if (role === Role.STUDENT) {
    const [_, contactHash, experience] = rawUser as RawStudent

    const baseUser: BaseUser = {
      account,
      userName,
      languages: languagesRaw.map((l: bigint) => Number(l)),
      subjects: subjectsRaw.map((l: bigint) => Number(l)),
    }

    const student: Student = {
      account,
      baseUser,
      contactHash,
      experience: Number(experience),
      role,
    }

    return student
  }

  const [
    _,
    validated,
    yearsOfExperience,
    sessionCount,
    hourlyRate,
    timeslotsHash,
    reviewsHash,
  ] = rawUser as RawMentor

  const reviews = await getMentorReviews(reviewsHash)

  const mentor: MentorStruct = {
    account,
    baseUser,
    validated,
    yearsOfExperience: Number(yearsOfExperience),
    sessionCount: Number(sessionCount),
    hourlyRate: Number(hourlyRate),
    timeslotsHash,
    reviewsHash,
    role,
    reviews,
  }

  return mentor
}

function getContract(): ethers.Contract {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
  )

  return new ethers.Contract(
    DEVMENTOR_CONTRACT_ADDRESS,
    DEVMENTOR_CONTRACT_ABI,
    provider
  )
}
