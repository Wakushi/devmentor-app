import { Skeleton } from "./skeleton"

export default function CalendarSkeleton() {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeks = 5

  return (
    <div className="w-full max-w-[261px] p-4 border rounded-lg shadow-sm">
      <div className="flex gap-8 justify-center items-center mb-4">
        <Skeleton className="h-6 w-6 bg-dim bg-opacity-15" />
        <Skeleton className="h-6 w-[100px] bg-dim bg-opacity-15" />
        <Skeleton className="h-6 w-6 bg-dim bg-opacity-15" />
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((_, index) => (
          <Skeleton key={index} className="h-4 w-full bg-dim bg-opacity-15" />
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: weeks * 7 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-full bg-dim bg-opacity-15" />
        ))}
      </div>
    </div>
  )
}
