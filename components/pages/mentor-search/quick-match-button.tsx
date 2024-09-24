import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"

export default function QuickMatchButton() {
  return (
    <div className="glass flex flex-col items-center justify-center p-8 rounded shadow text-center">
      <Button className="flex text-body items-center gap-2 px-6 py-3 rounded-full">
        <IoIosFlash />
        Quick Match with Free Mentor
      </Button>
      <p className="text-sm text-gray-600 mt-2">
        Instantly connect with an available free mentor
      </p>
    </div>
  )
}
