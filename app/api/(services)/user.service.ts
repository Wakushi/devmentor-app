import { MeetingEvent } from "@/lib/types/timeslot.type"
import { Address } from "viem"
import {
  addSubDocument,
  deleteSubDocument,
  getSubCollection,
  updateSubDocument,
} from "./base.service"

const USER_COLLECTION = "users"
const MEETING_EVENTS_COLLECTION = "meeting-events"

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
