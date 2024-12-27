import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { timezones } from "@/lib/timezones"

export default function TimezoneSelector({
  timezone = "UTC+00:00",
  handleSelectTimezone,
}: {
  timezone?: string
  handleSelectTimezone: (timezone: string) => void
}) {
  return (
    <div>
      <Select
        value={timezone}
        onValueChange={(value) => handleSelectTimezone(value)}
      >
        <SelectTrigger className="max-w-[200px]">
          <SelectValue placeholder="Select timezone..." />
        </SelectTrigger>
        <SelectContent>
          {timezones.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
