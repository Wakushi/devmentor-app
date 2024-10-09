import { PINATA_GATEWAY_BASE_URL } from "@/lib/constants"
import { Review } from "@/lib/types/review.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"

export async function getMentorTimeslots(mentor: Mentor): Promise<Timeslot[]> {
  const response = await fetch(
    `${PINATA_GATEWAY_BASE_URL}/${mentor.timeslotsHash}`
  )
  const data = await response.json()
  return (JSON.parse(data) as Timeslot[]) || []
}

export async function pinMentorTimeslots(
  mentor: Mentor,
  timeslots: Timeslot[]
): Promise<string> {
  if (mentor.timeslotsHash) {
    await unpinFile(mentor.timeslotsHash)
  }

  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      json: JSON.stringify(timeslots),
      filename: mentor.baseUser.userName,
    }),
  })

  const { ipfsHash: timeslotsHash } = await response.json()
  return timeslotsHash
}

export async function unpinFile(hash: string): Promise<void> {
  const response = await fetch("/api/ipfs/json", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hash,
    }),
  })

  await response.json()
}
