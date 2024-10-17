"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import SessionRating from "./pages/dashboard/(session-card)/session-rating"
import { Button } from "./ui/button"

export default function RatingDialog({
  dialogOpen,
  setDialogOpen,
  onRateMentor,
}: {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  onRateMentor: (rating: number) => void
}) {
  const [rating, setRating] = useState<number>(3)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Evaluate your mentorship session</DialogTitle>
          <DialogDescription>
            Your feedback helps us pair you with the ideal mentor for future
            sessions.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <SessionRating rating={rating} setRating={setRating} />
          <Button onClick={() => onRateMentor(rating)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
