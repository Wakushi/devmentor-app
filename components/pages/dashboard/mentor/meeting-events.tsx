import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { toast } from "@/hooks/use-toast"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"
import { msToReadableDuration } from "@/lib/utils"
import { FaCircleCheck } from "react-icons/fa6"
import {
  createMeetingEvent,
  deleteMeetingEvent,
  updateMeetingEvent,
} from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { MdError } from "react-icons/md"
import { useQueryClient } from "@tanstack/react-query"

const meetingEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  description: z.string().optional(),
})

export function MeetingEvents({
  mentor,
  meetingEvents,
}: {
  mentor: Mentor
  meetingEvents: MeetingEvent[]
}) {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<MeetingEvent | null>(null)
  const [events, setEvents] = useState<MeetingEvent[]>(meetingEvents)

  useEffect(() => {
    setEvents(meetingEvents)
  }, [meetingEvents])

  const form = useForm<z.infer<typeof meetingEventSchema>>({
    resolver: zodResolver(meetingEventSchema),
    defaultValues: {
      name: "",
      duration: 0,
      description: "",
    },
  })

  if (!mentor) return

  async function onSubmit(data: z.infer<typeof meetingEventSchema>) {
    try {
      if (editingEvent) {
        await handleUpdateMeetingEvent({
          ...editingEvent,
          ...data,
        })
      } else {
        await handleCreateMeetingEvent({
          ...data,
          mentorAddress: mentor.account,
        })
      }

      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    }
  }

  async function handleCreateMeetingEvent(
    meetingEvent: Omit<MeetingEvent, "id">
  ): Promise<void> {
    try {
      const { success, data, error } = await createMeetingEvent(meetingEvent)

      if (success && data) {
        toast({
          title: "Success",
          description: "Meeting event created !",
          action: <FaCircleCheck className="text-white" />,
        })

        refreshList()
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Failed to add meeting event:", error)

      toast({
        title: "Error",
        description: "Failed to add meeting event. Please try again.",
        action: <MdError className="text-white" />,
      })
    }
  }

  async function handleUpdateMeetingEvent(
    meetingEvent: Omit<MeetingEvent, "id">
  ): Promise<void> {
    try {
      const { success, data, error } = await updateMeetingEvent(meetingEvent)

      if (success) {
        toast({
          title: "Success",
          description: "Meeting event updated !",
          action: <FaCircleCheck className="text-white" />,
        })

        refreshList()
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Failed to update meeting event:", error)

      toast({
        title: "Error",
        description: "Failed to update meeting event. Please try again.",
        action: <MdError className="text-white" />,
      })
    }
  }

  async function handleDelete(meetingEvent: MeetingEvent) {
    try {
      const { success, error } = await deleteMeetingEvent(meetingEvent)

      if (success) {
        toast({
          title: "Success",
          description: "Meeting event deleted !",
          action: <FaCircleCheck className="text-white" />,
        })

        refreshList()
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Failed to delete meeting event:", error)

      toast({
        title: "Error",
        description: "Failed to delete meeting event. Please try again.",
        action: <MdError className="text-white" />,
      })
    }
  }

  async function handleEdit(event: MeetingEvent) {
    setEditingEvent(event)
    form.reset(event)
    setIsDialogOpen(true)
  }

  function refreshList() {
    queryClient.refetchQueries({
      queryKey: [QueryKeys.MEETING_EVENTS],
    })
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingEvent(null)
              form.reset()
            }}
          >
            Create new Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Meeting Event" : "Create Meeting Event"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your meeting event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input placeholder="Event Name" {...field} />
                )}
              />
              <Controller
                name="duration"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Duration (ms)"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea placeholder="Description" {...field} />
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">
                {editingEvent ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {events.map((event) => (
          <Card key={event.id} className="glass text-white w-[45%]">
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
              <Button variant="outline" onClick={() => handleEdit(event)}>
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the meeting event "{event.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button onClick={() => handleDelete(event)}>
                        Confirm
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
