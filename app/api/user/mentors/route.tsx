import { NextRequest, NextResponse } from "next/server"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { Mentor } from "@/lib/types/user.type"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const mentors = await getMentors()

    return NextResponse.json({ mentors })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}

async function getMentors(): Promise<Mentor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MENTORS_MOCK)
    }, 1000)
  })
}
