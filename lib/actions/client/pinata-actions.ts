import { Timeslot } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"

export async function pinMentorTimeslots(
  mentor: Mentor,
  timeslots: Timeslot[]
): Promise<Mentor> {
  if (mentor.timeslotsHash) {
    await unpinFile(mentor.timeslotsHash)
    delete mentor.timeslotsHash
  }

  const response = await fetch("/api/ipfs/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      json: JSON.stringify(timeslots),
      filename: mentor.name,
    }),
  })

  const { IpfsHash } = await response.json()
  return { ...mentor, timeslotsHash: IpfsHash }
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
