import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock } from "lucide-react"
import { Timeslot } from "@/lib/types/timeslot.type"
import { MdEdit } from "react-icons/md"
import { Button } from "@/components/ui/button"

export default function PaymentAndValidationCard({
  timeslot,
  handleEditTimeslot,
}: {
  timeslot: Timeslot
  handleEditTimeslot: () => void
}) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="flex-1 h-fit max-w-[800px] glass text-white border-none fade-in-bottom">
      <CardHeader>
        <CardTitle>Let's Double-Check</CardTitle>
        <p className="text-dim">Exciting details of your upcoming session</p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleEditTimeslot}
          className="flex items-center max-h-none justify-between w-full h-auto max-w-none p-4 rounded-xl shadow-lg hover:shadow-xl bg-primary-shade hover:opacity-80 cursor-pointer"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-base">
              <CalendarDays className="w-5 h-5" />
              <span>{formatDate(timeslot.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Clock className="w-5 h-5" />
              <span>
                {formatTime(timeslot.startTime)} -{" "}
                {formatTime(timeslot.endTime)}
              </span>
            </div>
          </div>
          <MdEdit className="text-3xl" />
        </Button>
      </CardContent>
    </Card>
  )
}
