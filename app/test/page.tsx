import AvailabilityPicker from "@/components/timeslot-selection/availability-picker"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"

export default function TestPage() {
  const mentor = MENTORS_MOCK[0]
  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <AvailabilityPicker mentor={mentor} />
    </div>
  )
}
