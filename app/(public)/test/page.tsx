"use client"

import { Button } from "@/components/ui/button"

export default function TestPage() {
  async function saveData(): Promise<void> {}

  async function readData(): Promise<void> {}

  return (
    <div className="p-4 pt-[8rem] min-h-screen flex flex-col justify-center items-center m-auto w-[90%]">
      <div className="flex flex-col gap-2">
        <Button className="w-[120px]" onClick={saveData}>
          Save data
        </Button>
        <Button className="w-[120px]" onClick={readData}>
          Read data
        </Button>
      </div>
    </div>
  )
}
