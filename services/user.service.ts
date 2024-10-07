import { BASE_USER_PATH } from "@/lib/constants"
import { Timeslot } from "@/lib/types/timeslot.type"
import { Address } from "viem"

export async function getTimeslotsByAddress(
  mentorAddress: Address
): Promise<Timeslot[]> {
  const response = await fetch(
    `${BASE_USER_PATH}/timeslots?address=${mentorAddress}`
  )
  const { timeslots } = await response.json()
  return timeslots
}

export async function updateTimeslots(timeslots: Timeslot[]): Promise<void> {
  await fetch(`${BASE_USER_PATH}/timeslots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timeslots }),
  })
}

export async function updateTimeslot({
  timeslot,
  timeslotId,
  mentorAddress,
}: {
  timeslot: Timeslot
  timeslotId: number
  mentorAddress: Address
}): Promise<void> {
  await fetch(`${BASE_USER_PATH}/timeslots/${timeslotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mentorAddress, timeslot }),
  })
}
