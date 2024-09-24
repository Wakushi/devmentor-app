import {
  createUser,
  getUserByAddress,
} from "@/lib/actions/server/firebase-actions"
import { createUserJwtToken } from "@/lib/jwt"
import { User } from "@/lib/types/user.type"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user: User = await req.json()
    const createdUser = await createUser(user)
    return NextResponse.json({ createdUser })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 })
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      )
    }

    const user = await getUserByAddress(address.toLowerCase())

    if (!user) {
      return NextResponse.json({ registeredUser: null }, { status: 404 })
    }

    const token = await createUserJwtToken(user)

    const response = NextResponse.json({ registeredUser: user })
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
