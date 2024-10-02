import { PINATA_GATEWAY_BASE_URL } from "@/lib/constants"
import { Review } from "@/lib/types/review.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import { MentorStruct } from "@/lib/types/user.type"

export async function getMentorTimeslots(
  mentor: MentorStruct
): Promise<Timeslot[]> {
  const response = await fetch(
    `${PINATA_GATEWAY_BASE_URL}/${mentor.timeslotsHash}`
  )
  const data = await response.json()
  return (JSON.parse(data) as Timeslot[]) || []
}

export async function pinMentorTimeslots(
  mentor: MentorStruct,
  timeslots: Timeslot[]
): Promise<MentorStruct> {
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

export async function getMentorReviews(reviewsHash: string): Promise<Review[]> {
  if (!reviewsHash) return []

  const response = await fetch(`${PINATA_GATEWAY_BASE_URL}/${reviewsHash}`)
  const data = await response.json()
  return (JSON.parse(data) as Review[]) || []
}
