import { Address } from "viem"
import { NextRequest, NextResponse } from "next/server"
import { Timeslot } from "@/lib/types/timeslot.type"
import {
  addUserTimeslots,
  deleteUserTimeslots,
  getUserTimeslots,
} from "@/lib/actions/server/firebase-actions"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { timeslots, mentorAddress } = await req.json()

  try {
    await deleteUserTimeslots(mentorAddress)
    await addUserTimeslots(mentorAddress, timeslots)
    return NextResponse.json({ timeslots })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address") as Address

  try {
    const timeslots: Timeslot[] = await getUserTimeslots(address)
    return NextResponse.json({ timeslots })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}
