import { Address } from "viem"
import { NextRequest, NextResponse } from "next/server"
import { Timeslot } from "@/lib/types/timeslot.type"
import {
  getAllTimeslotsByAddress,
  updateAllTimelots,
} from "../../(services)/user.service"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address") as Address

  try {
    const timeslots: Timeslot[] = await getAllTimeslotsByAddress(address)
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { timeslots, mentorAddress } = await req.json()

  try {
    await updateAllTimelots(mentorAddress, timeslots)
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
