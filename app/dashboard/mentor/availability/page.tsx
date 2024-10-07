"use client"

import { MeetingEvents } from "@/components/pages/dashboard/mentor/meeting-events"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/stores/user.store"
import LoadingScreen from "@/components/ui/loading-screen"
import { Mentor } from "@/lib/types/user.type"
import { Timeslot } from "@/lib/types/timeslot.type"
import useTimeslotsQuery from "@/hooks/queries/timeslots-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { useQueryClient } from "@tanstack/react-query"
import { updateTimeslots } from "@/services/user.service"
import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { toast } from "@/hooks/use-toast"
import { FaCircleCheck } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import useMeetingEventsQuery from "@/hooks/queries/meeting-event-query"

export default function AvailabilityPage() {
  const queryClient = useQueryClient()

  const { user, loadingUser } = useUser() as {
    user: Mentor
    loadingUser: boolean
  }

  const timeslotsQuery = useTimeslotsQuery(user?.account)
  const { data: timeslots } = timeslotsQuery

  const meetingEventsQuery = useMeetingEventsQuery(user?.account)
  const { data: meetingEvents } = meetingEventsQuery

  if (loadingUser) {
    return <LoadingScreen />
  }

  if (!user) return

  async function handleSaveAvailabilities(
    availabilities: Timeslot[]
  ): Promise<void> {
    try {
      const { success, error } = await updateTimeslots(availabilities)

      if (success) {
        toast({
          title: "Success",
          description: "Your availabilities are up to date!",
          action: <FaCircleCheck className="text-white" />,
        })

        queryClient.invalidateQueries({
          queryKey: [QueryKeys.TIMESLOTS, user.account],
        })
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Failed to update timeslots:", error)

      toast({
        title: "Error",
        description: "Failed to update availabilities. Please try again.",
        action: <MdError className="text-white" />,
      })
    }
  }

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <div className="flex w-full gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl">Availabilities</h2>
            <p className="text-small font-normal font-sans text-dim">
              Update your availabilities
            </p>
          </div>
          <AvailabilityPicker
            mentor={user}
            timeslots={timeslots ?? []}
            handleSaveAvailabilities={handleSaveAvailabilities}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl">Events</h2>
            <p className="text-small font-normal font-sans text-dim">
              Manage your events
            </p>
          </div>
          <MeetingEvents mentor={user} meetingEvents={meetingEvents ?? []} />
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}
