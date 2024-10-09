"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { msToReadableDuration } from "@/lib/utils"
import clsx from "clsx"
import { FaTrash } from "react-icons/fa"

export default function MeetingEventCard({
  event,
  selected,
  handleEdit,
  handleDelete,
  handleSelectEvent,
}: {
  event: MeetingEvent
  selected: boolean
  handleEdit: (event: MeetingEvent) => void
  handleDelete: (event: MeetingEvent) => void
  handleSelectEvent: (event: MeetingEvent) => void
}) {
  return (
    <Card
      onClick={() => handleSelectEvent(event)}
      className={clsx(
        "glass z-[1] text-white border-transparent border-2 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl rounded-md border-b-secondary w-[45%] max-w-[300px]",
        {
          "border-primary": selected,
        }
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl">{event.name}</CardTitle>
        <CardDescription>
          Duration: {msToReadableDuration(event.duration)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-small min-h-[21px]">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline-white" onClick={() => handleEdit(event)}>
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <FaTrash className="border w-[36px] h-[36px] rounded-md p-2 hover:border-error hover:text-error" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                meeting event "{event.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={() => handleDelete(event)}>Confirm</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
