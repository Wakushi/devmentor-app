import { MeetingEvent, Timeslot } from "@/lib/types/timeslot.type"
import { Address } from "viem"
import {
  addDocument,
  addSubDocument,
  deleteSubDocument,
  getDocument,
  getSubCollection,
  updateDocument,
  updateSubDocument,
} from "./base.service"
import { adminDb } from "@/firebase-admin"

const USER_COLLECTION = "users"
const MEETING_EVENTS_COLLECTION = "meeting-events"

/////////////////
//  TIMESLOTS  //
/////////////////

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
): Promise<Timeslot[]> {
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
    return timeslots
  }

  await updateDocument({
    collectionPath: USER_COLLECTION,
    docId: userDocument.id,
    data: {
      timeslots: timeslotsMap,
    },
  })

  return timeslots
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

//////////////////////
//  MEETING EVENTS  //
//////////////////////

export async function getAllMeetingEventsByAddress(
  address: Address
): Promise<MeetingEvent[]> {
  const meetingEvents = await getSubCollection<MeetingEvent>({
    parentCollectionPath: USER_COLLECTION,
    childCollectionPath: MEETING_EVENTS_COLLECTION,
    docId: address,
  })

  return meetingEvents
}

export async function createMeetingEvent(
  address: Address,
  meetingEvent: MeetingEvent
): Promise<MeetingEvent> {
  const newMeetingEvent = await addSubDocument<MeetingEvent>({
    parentCollectionPath: USER_COLLECTION,
    childCollectionPath: MEETING_EVENTS_COLLECTION,
    parentDocId: address,
    data: meetingEvent,
  })

  return newMeetingEvent
}

export async function updateMeetingEvent(
  address: Address,
  meetingEvent: MeetingEvent
): Promise<MeetingEvent> {
  if (!meetingEvent.id) {
    throw new Error("Can't update meeting event, missing id")
  }

  const updatedMeetingEvent = await updateSubDocument({
    parentCollectionPath: USER_COLLECTION,
    childCollectionPath: MEETING_EVENTS_COLLECTION,
    parentDocId: address,
    childDocId: meetingEvent.id,
    data: meetingEvent,
  })

  return updatedMeetingEvent
}

export async function deleteMeetingEvent(
  address: Address,
  meetingEvent: MeetingEvent
): Promise<void> {
  if (!meetingEvent.id) {
    throw new Error("Can't delete meeting event, missing id")
  }

  await deleteSubDocument({
    parentCollectionPath: USER_COLLECTION,
    childCollectionPath: MEETING_EVENTS_COLLECTION,
    parentDocId: address,
    childDocId: meetingEvent.id,
  })
}
