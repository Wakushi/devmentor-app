import {
  BASE_USER_PATH,
  MEETING_EVENTS_PATH,
  TIMEZONE_PATH,
} from "@/lib/constants"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { getTimeZone } from "@/lib/utils"
import { Address } from "viem"

//////////////////////
//  MEETING EVENTS  //
//////////////////////

export async function getMeetingEventsByAddress(
  mentorAddress: Address
): Promise<MeetingEvent[]> {
  const response = await fetch(
    `${BASE_USER_PATH}${MEETING_EVENTS_PATH}?address=${mentorAddress}`
  )

  const { meetingEvents } = await response.json()

  return meetingEvents
}

export async function createMeetingEvent(
  meetingEvent: MeetingEvent
): Promise<{ success: boolean; data?: MeetingEvent; error?: string }> {
  const response = await fetch(`${BASE_USER_PATH}${MEETING_EVENTS_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meetingEvent }),
  })

  const result = await response.json()

  if (!response.ok) {
    return { success: false, error: result.error || "An error occurred" }
  }

  return { success: true, data: result.data }
}

export async function updateMeetingEvent(
  meetingEvent: MeetingEvent
): Promise<{ success: boolean; data?: MeetingEvent; error?: string }> {
  const response = await fetch(`${BASE_USER_PATH}${MEETING_EVENTS_PATH}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meetingEvent }),
  })

  const result = await response.json()

  if (!response.ok) {
    return { success: false, error: result.error || "An error occurred" }
  }

  return { success: true, data: result.data }
}

export async function deleteMeetingEvent(
  meetingEvent: MeetingEvent
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`${BASE_USER_PATH}${MEETING_EVENTS_PATH}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meetingEvent }),
  })

  const result = await response.json()

  if (!response.ok) {
    return { success: false, error: result.error || "An error occurred" }
  }

  return { success: true }
}

////////////////
//  TIMEZONE  //
////////////////

export async function getUserTimezone(userAddress: Address): Promise<string> {
  if (!userAddress) return getTimeZone().value

  const response = await fetch(
    `${BASE_USER_PATH}${TIMEZONE_PATH}?address=${userAddress}`
  )
  const result = await response.json()

  if (!response.ok || !result?.timezone) {
    return getTimeZone().value
  }

  return result.timezone
}

export async function updateUserTimezone(timezone: string): Promise<{
  success: boolean
  data?: string
  error?: string
}> {
  const response = await fetch(`${BASE_USER_PATH}${TIMEZONE_PATH}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timezone }),
  })

  const result = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: result.error || "An error occurred",
    }
  }

  return { success: true }
}
