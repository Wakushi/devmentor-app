import { NextRequest, NextResponse } from "next/server"
import { updateOneTimeslot } from "@/app/api/(services)/user.service"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { mentorAddress, timeslot } = await req.json()
  const id = params.id

  try {
    await updateOneTimeslot({
      address: mentorAddress,
      timeslot,
      timeslotIndex: +id,
    })
    return NextResponse.json({ message: "ok" })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 })
    }
  }
}
