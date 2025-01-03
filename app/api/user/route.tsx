import {
  DEVMENTOR_CONTRACT_ABI,
  DEVMENTOR_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { createUserJwtToken, getRequestUser } from "@/lib/crypto/jwt"
import { Role } from "@/lib/types/role.type"
import {
  BaseUser,
  Mentor,
  ContractMentor,
  ContractStudent,
  Student,
  Visitor,
} from "@/lib/types/user.type"
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

    let user: Visitor | Student | Mentor

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
        )) as Mentor
        break
    }

    return NextResponse.json({ user })
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
    const { role } = await req.json()

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

    const response = NextResponse.json({ success: true })

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
  rawUser: ContractStudent | ContractMentor,
  role: Role
): Promise<Student | Mentor> {
  const [baseUserRaw] = rawUser
  const [account, userName, languagesRaw, subjectsRaw] = baseUserRaw

  const baseUser: BaseUser = {
    account,
    userName,
    languages: languagesRaw.map((l: bigint) => Number(l)),
    subjects: subjectsRaw.map((l: bigint) => Number(l)),
  }

  if (role === Role.STUDENT) {
    const [_, contactHash, experience] = rawUser as ContractStudent

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
    totalRating,
  ] = rawUser as ContractMentor

  const mentor: Mentor = {
    account,
    baseUser,
    validated,
    yearsOfExperience: Number(yearsOfExperience),
    sessionCount: Number(sessionCount),
    hourlyRate: Number(hourlyRate),
    totalRating: Number(totalRating),
    role,
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
