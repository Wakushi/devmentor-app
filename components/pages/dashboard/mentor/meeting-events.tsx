"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { MeetingEvent } from "@/lib/types/timeslot.type"
import { Mentor } from "@/lib/types/user.type"
import { FaCircleCheck } from "react-icons/fa6"
import {
  createMeetingEvent,
  deleteMeetingEvent,
  updateMeetingEvent,
} from "@/services/user.service"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { MdError } from "react-icons/md"
import { useQueryClient } from "@tanstack/react-query"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"
import MeetingEventCard from "./meeting-event-card"

const meetingEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  description: z.string().optional(),
  durationUnit: z.enum(["min", "hrs"]),
})

export function MeetingEvents({ mentor }: { mentor: Mentor }) {
  const queryClient = useQueryClient()

  const meetingEventsQuery = useMeetingEventsQuery(mentor.account)
  const { data: meetingEvents } = meetingEventsQuery

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<MeetingEvent | null>(null)
  const [events, setEvents] = useState<MeetingEvent[]>([])

  useEffect(() => {
    setEvents(meetingEvents ?? [])
  }, [meetingEventsQuery.data, meetingEventsQuery.isLoading])

  const form = useForm<z.infer<typeof meetingEventSchema>>({
    resolver: zodResolver(meetingEventSchema),
    defaultValues: {
      name: "",
      duration: 30,
      durationUnit: "min",
      description: "",
    },
  })

  if (!mentor) return

  async function onSubmit(data: z.infer<typeof meetingEventSchema>) {
    try {
      const durationInMs = convertDurationToMs(data.duration, data.durationUnit)

      if (editingEvent) {
        await handleUpdateMeetingEvent({
          ...editingEvent,
          ...data,
          duration: durationInMs,
        })
        return
      }

      await handleCreateMeetingEvent({
        ...data,
        duration: durationInMs,
        mentorAddress: mentor.account,
      })
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

        setIsDialogOpen(false)
        refreshList()
        form.reset()
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
      const { success, error } = await updateMeetingEvent(meetingEvent)

      if (success) {
        toast({
          title: "Success",
          description: "Meeting event updated !",
          action: <FaCircleCheck className="text-white" />,
        })

        setIsDialogOpen(false)
        refreshList()
        form.reset()
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
    const { duration, unit } = convertMsToDuration(event.duration)
    setEditingEvent(event)
    form.reset({
      ...event,
      duration: duration,
      durationUnit: unit,
    })
    setIsDialogOpen(true)
  }

  function refreshList() {
    queryClient.refetchQueries({
      queryKey: [QueryKeys.MEETING_EVENTS, mentor.account],
    })
  }

  function convertDurationToMs(duration: number, unit: "min" | "hrs"): number {
    return unit === "min" ? duration * 60 * 1000 : duration * 60 * 60 * 1000
  }

  function convertMsToDuration(ms: number): {
    duration: number
    unit: "min" | "hrs"
  } {
    const minutes = ms / (60 * 1000)
    if (minutes < 60) {
      return { duration: minutes, unit: "min" }
    } else {
      return { duration: minutes / 60, unit: "hrs" }
    }
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
              <div className="flex space-x-2">
                <Controller
                  name="duration"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      placeholder="Duration"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value || "0"))
                      }
                      className="w-2/3"
                    />
                  )}
                />
                <Controller
                  name="durationUnit"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-1/3">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min">Minutes</SelectItem>
                        <SelectItem value="hrs">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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
          <MeetingEventCard
            key={event.id}
            event={event}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
