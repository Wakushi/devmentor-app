import {
  createSession,
  getSessionsByStudentAddress,
} from "@/lib/actions/server/firebase-actions"
import { Session } from "@/lib/types/session.type"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session: Session = await req.json()
    const createdSession = await createSession(session)
    return NextResponse.json({ createdSession })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to add session" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const studentAddress = searchParams.get("studentAddress") as `0x`

    if (!studentAddress) {
      return NextResponse.json(
        { error: "Missing student address" },
        { status: 400 }
      )
    }

    const sessions = await getSessionsByStudentAddress(studentAddress)

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}
