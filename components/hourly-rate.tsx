import { CiDollar } from "react-icons/ci"

export default function HourlyRate({ hourlyRate }: { hourlyRate: number }) {
  return (
    <>
      <CiDollar className="w-4 h-4 mr-2" />
      {hourlyRate > 0 ? <span>${hourlyRate}/hour</span> : <span>Free</span>}
    </>
  )
}
