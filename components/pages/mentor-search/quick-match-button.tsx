import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"

export default function QuickMatchButton() {
  return (
    <div className="glass border border-stone-800 flex flex-col items-center justify-center p-8 rounded-md shadow text-center">
      <Button
        variant="secondary"
        className="flex text-lg items-center gap-2 px-6 py-6"
      >
        Quick Match
        <IoIosFlash />
      </Button>
      <p className="text-sm text-dim mt-2">
        Instantly connect with an available free mentor
      </p>
    </div>
  )
}
