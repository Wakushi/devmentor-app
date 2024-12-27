import { getRequestUser } from "@/lib/crypto/jwt"
import { Role } from "@/lib/types/role.type"
import { NextRequest, NextResponse } from "next/server"
import { Address } from "viem"
import {
  getUserTimezone,
  updateUserTimezone,
} from "../../(services)/user.service"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address") as Address

  try {
    const timezone = await getUserTimezone(address)
    return NextResponse.json({ timezone })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const { timezone } = (await req.json()) as { timezone: string }

  if (!timezone) {
    return NextResponse.json({ error: "Missing timezone" }, { status: 400 })
  }

  try {
    const user = await getRequestUser(req)

    if (!user || !user.address) {
      return NextResponse.json({ error: "Unidentified user" }, { status: 400 })
    }

    if (![Role.MENTOR, Role.STUDENT].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateUserTimezone(timezone, user.address)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 })
  }
}
