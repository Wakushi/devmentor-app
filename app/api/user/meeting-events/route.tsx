import { Address } from "viem"
import { NextRequest, NextResponse } from "next/server"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import {
  createMeetingEvent,
  deleteMeetingEvent,
  getAllMeetingEventsByAddress,
  updateMeetingEvent,
} from "../../(services)/user.service"
import { getRequestUser } from "@/lib/crypto/jwt"
import { Role } from "@/lib/types/role.type"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address") as Address

  try {
    const meetingEvents: MeetingEvent[] = await getAllMeetingEventsByAddress(
      address
    )
    return NextResponse.json({ meetingEvents })
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
  const { meetingEvent } = await req.json()

  if (!meetingEvent) {
    return NextResponse.json(
      { error: "Missing meeting event" },
      { status: 400 }
    )
  }

  const user = await getRequestUser(req)

  if (!user || user.role !== Role.MENTOR) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const newMeetingEvent = await createMeetingEvent(user.address, meetingEvent)

    return NextResponse.json(
      { success: true, data: newMeetingEvent },
      { status: 200 }
    )
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown error" },
        { status: 500 }
      )
    }
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const { meetingEvent } = await req.json()

  if (!meetingEvent) {
    return NextResponse.json(
      { error: "Missing meeting event" },
      { status: 400 }
    )
  }

  const user = await getRequestUser(req)

  if (!user || user.role !== Role.MENTOR) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const updatedMeetingEvent = await updateMeetingEvent(
      user.address,
      meetingEvent
    )

    return NextResponse.json(
      { success: true, data: updatedMeetingEvent },
      { status: 200 }
    )
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown error" },
        { status: 500 }
      )
    }
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const { meetingEvent } = await req.json()

  if (!meetingEvent) {
    return NextResponse.json(
      { error: "Missing meeting event" },
      { status: 400 }
    )
  }

  const user = await getRequestUser(req)

  if (!user || user.role !== Role.MENTOR) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await deleteMeetingEvent(user.address, meetingEvent)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown error" },
        { status: 500 }
      )
    }
  }
}
