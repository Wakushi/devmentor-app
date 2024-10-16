import { NextRequest, NextResponse } from "next/server"
import { getRequestUser } from "@/lib/crypto/jwt"
import { getUserByAddress } from "../../(services)/user.service"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const userPayload = await getRequestUser(req)

    if (!userPayload) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = await getUserByAddress(userPayload.address)

    console.log("login with token user: ", user)

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
