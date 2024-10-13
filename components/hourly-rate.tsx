import { CiDollar } from "react-icons/ci"

export default function HourlyRate({ hourlyRate }: { hourlyRate: number }) {
  return (
    <div className="flex items-center gap-2">
      <CiDollar className="w-5 h-5" />
      <div className="flex items-center text-small text-dim">
        {hourlyRate > 0 ? <span>${hourlyRate}/hour</span> : <span>Free</span>}
      </div>
    </div>
  )
}
