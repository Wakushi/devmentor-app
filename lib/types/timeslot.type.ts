export type Timeslot = {
  id: string
  mentorId: string
  date: number
  startTime: number
  endTime: number
  isBooked: boolean
  studentId?: string
}
