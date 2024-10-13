"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getFileByHash } from "@/services/ipfs.service"
import { ReactNode, useEffect, useState } from "react"

export default function StudentGoalsDialog({
  sessionGoalHash,
  children,
}: {
  sessionGoalHash: string
  children: ReactNode
}) {
  const [objectives, setObjectives] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (dialogOpen && !objectives && !isLoading) {
      setIsLoading(true)
      getFileByHash(sessionGoalHash)
        .then(({ sessionGoals }) => {
          setObjectives(sessionGoals)
        })
        .catch((error) => {
          console.error("Failed to fetch objectives:", error)
          setObjectives("Failed to load objectives.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [dialogOpen, objectives, sessionGoalHash])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div onClick={() => setDialogOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student objectives</DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading..." : objectives}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
