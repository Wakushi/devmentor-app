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

export default function MeetingEventCard({
  event,
  handleEdit,
  handleDelete,
}: {
  event: MeetingEvent
  handleEdit: (event: MeetingEvent) => void
  handleDelete: (event: MeetingEvent) => void
}) {
  return (
    <Card className="glass text-white border-transparent rounded-md border-b-4 border-b-primary w-[45%]">
      <CardHeader>
        <CardTitle className="text-xl">{event.name}</CardTitle>
        <CardDescription>
          Duration: {msToReadableDuration(event.duration)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-small">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline-white" onClick={() => handleEdit(event)}>
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
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
