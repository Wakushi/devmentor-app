import { adminDb } from "@/firebase-admin"
import { Timeslot } from "@/lib/types/timeslot.type"
import { Address } from "viem"

enum Collection {
  USER_COLLECTION = "users",
  TIMESLOT_COLLECTION = "timeslots",
}

export async function addUserTimeslots(
  account: Address,
  timeslots: Timeslot[]
): Promise<void> {
  console.log("Adding " + timeslots.length + " timeslots")

  await batchAddUserDocuments({
    account,
    collectionPath: Collection.TIMESLOT_COLLECTION,
    documents: timeslots,
  })
}

export async function getUserTimeslots(account: Address): Promise<Timeslot[]> {
  const timeslotsRef = adminDb
    .collection(Collection.USER_COLLECTION)
    .doc(account)
    .collection(Collection.TIMESLOT_COLLECTION)

  try {
    const snapshot = await timeslotsRef.get()
    const timeslots: Timeslot[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Timeslot)
    )

    console.log("Fetched " + timeslots.length + " timeslots")

    return timeslots
  } catch (error) {
    console.error("Error fetching user timeslots:", error)
    throw error
  }
}

export async function deleteUserTimeslots(account: Address): Promise<void> {
  const timeslotsRef = adminDb
    .collection(Collection.USER_COLLECTION)
    .doc(account)
    .collection(Collection.TIMESLOT_COLLECTION)

  const batchSize = 500
  let batchCount = 0

  try {
    while (true) {
      const snapshot = await timeslotsRef.limit(batchSize).get()

      if (snapshot.size === 0) {
        break
      }

      const batch = adminDb.batch()

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()
      batchCount++

      console.log(
        `Batch ${batchCount} completed, deleted ${snapshot.size} documents`
      )

      if (snapshot.size < batchSize) {
        break
      }
    }

    console.log(`Deleted all timeslots for user ${account}`)
  } catch (error) {
    console.error("Error deleting user timeslots:", error)
    throw error
  }
}

async function batchAddUserDocuments({
  account,
  collectionPath,
  documents,
}: {
  account: Address
  collectionPath: Collection
  documents: any[]
}) {
  const batch = adminDb.batch()

  documents.forEach((doc) => {
    const docRef = adminDb
      .collection(Collection.USER_COLLECTION)
      .doc(account)
      .collection(collectionPath)
      .doc()
    batch.set(docRef, doc)
  })

  try {
    await batch.commit()
    console.log("Batch write successful")
  } catch (error) {
    console.error("Error performing batch write:", error)
  }
}
