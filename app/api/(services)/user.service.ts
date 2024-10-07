import { Timeslot } from "@/lib/types/timeslot.type"
import { Address } from "viem"
import { addDocument, getDocument, updateDocument } from "./base.service"
import { adminDb } from "@/firebase-admin"

const USER_COLLECTION = "users"

export async function getAllTimeslotsByAddress(
  address: Address
): Promise<Timeslot[]> {
  const userDocument = await getDocument(USER_COLLECTION, address)

  if (!userDocument) {
    return []
  }

  const timeslots: Timeslot[] = Array.from(
    Object.values(userDocument.timeslots)
  )

  return timeslots
}

export async function updateAllTimelots(
  address: Address,
  timeslots: Timeslot[]
): Promise<void> {
  const userDocument = await getDocument(USER_COLLECTION, address)

  const timeslotsMap: { [key: number]: Timeslot } = {}

  timeslots.forEach((timeslot, index) => (timeslotsMap[index] = timeslot))

  if (!userDocument) {
    await addDocument({
      collectionPath: USER_COLLECTION,
      data: {
        address,
        timeslots: timeslotsMap,
      },
      customId: address,
    })
    return
  }

  await updateDocument(USER_COLLECTION, userDocument.id, {
    timeslots: timeslotsMap,
  })
}

export async function updateOneTimeslot({
  address,
  timeslot,
  timeslotIndex,
}: {
  address: Address
  timeslot: Timeslot
  timeslotIndex: number
}): Promise<void> {
  await adminDb
    .collection(USER_COLLECTION)
    .doc(address)
    .update({
      [`timeslots.${timeslotIndex}`]: timeslot,
    })
}
