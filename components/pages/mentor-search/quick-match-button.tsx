import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"

export default function QuickMatchButton() {
  return (
    <div className="glass flex flex-col items-center justify-center p-8 rounded-xl shadow text-center">
      <Button className="flex text-lg items-center gap-2 px-6 py-6 rounded-full">
        <IoIosFlash />
        Quick Match
      </Button>
      <p className="text-sm text-gray-600 mt-2">
        Instantly connect with an available free mentor
      </p>
    </div>
  )
}
