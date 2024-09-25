import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SessionCalendar() {
  const [selectedDate, setSelectedDate] = useState<any>(new Date())

  return (
    <Card className="flex-1 glass text-white max-w-fit">
      <CardHeader>
        <CardTitle>Select Date and Time</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          disabled={{ dayOfWeek: [0, 6] }}
          onSelect={(date) => {
            setSelectedDate(date)
          }}
          className="calendar rounded-md p-0 mb-4"
        />
      </CardContent>
    </Card>
  )
}
