import { Timeslot } from "../types/timeslot.type"
import { v4 as uuidv4 } from "uuid"

export function generateMockTimeslots(
  startDate: Date,
  months: number
): Timeslot[] {
  const timeslots: Timeslot[] = []
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + months)

  const mentorId = uuidv4()

  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue

    d.setHours(0, 0, 0, 0)

    const date = d.getTime()

    for (let hour = 10; hour < 18; hour++) {
      d.setHours(hour)
      const startTime = d.getTime()
      d.setHours(hour + 1)
      const endTime = d.getTime()

      const isBooked = Math.random() < 0.5

      timeslots.push({
        id: uuidv4(),
        mentorId,
        date,
        startTime,
        endTime,
        isBooked,
        studentId: isBooked ? uuidv4() : undefined,
      })
    }
  }

  return timeslots
}
