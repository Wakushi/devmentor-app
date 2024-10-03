import { Timeslot } from "@/lib/types/timeslot.type"
import { Address } from "viem"

export async function registerTimeslots(
  timeslots: Timeslot[],
  mentorAddress: Address
): Promise<void> {
  await fetch("/api/timeslots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timeslots, mentorAddress }),
  })
}