import { MeetingEvent } from "@/lib/types/timeslot.type"
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
import { FirebaseUser, Mentor, Student, Visitor } from "@/lib/types/user.type"
import { Role } from "@/lib/types/role.type"

const USER_COLLECTION = "users"
const MEETING_EVENTS_COLLECTION = "meeting-events"

export async function getFirebaseUserByAddress(
  address: Address
): Promise<FirebaseUser | null> {
  const firebaseUser = await getDocument<FirebaseUser>(USER_COLLECTION, address)
  return firebaseUser
}

export async function getUserByAddress(
  address: Address
): Promise<Visitor | Student | Mentor> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/user?address=${address}`
    )
    const { user } = await response.json()

    switch (user.role) {
      case Role.VISITOR:
        return user as Visitor
      case Role.STUDENT:
        return user as Student
      case Role.MENTOR:
        return user as Mentor
      default:
        return user as Visitor
    }
  } catch (error: any) {
    console.log("Error getting user: ", error)
    return { account: address, role: Role.VISITOR }
  }
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

////////////////
//  TIMEZONE  //
////////////////

export async function getUserTimezone(
  address: Address
): Promise<string | null> {
  const user = await getDocument<FirebaseUser>(USER_COLLECTION, address)

  if (!user) return null

  return user.timezone
}

export async function updateUserTimezone(
  timezone: string,
  address: Address
): Promise<void> {
  const firebaseUser = await getFirebaseUserByAddress(address)

  if (!firebaseUser) {
    await addDocument({
      collectionPath: USER_COLLECTION,
      customId: address,
      data: { address, timezone },
    })
    return
  }

  const updatedUser = { ...firebaseUser, timezone }

  await updateDocument({
    collectionPath: USER_COLLECTION,
    docId: firebaseUser.address,
    data: updatedUser,
  })
}
