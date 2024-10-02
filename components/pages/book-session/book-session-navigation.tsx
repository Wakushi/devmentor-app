import { Button } from "@/components/ui/button"
import { MentorStruct } from "@/lib/types/user.type"
import clsx from "clsx"
import CompleteSessionButton from "./complete-session-button"
import { BookStep } from "@/lib/types/book-session-form.type"

interface BookSessionNavigationProps {
  bookStep: BookStep
  steps: BookStep[]
  currentStepIndex: number
  currentStepValid: boolean
  handlePrevStep: () => void
  handleNextStep: () => void
  mentor: MentorStruct
  handleCreateSession: () => void
}

export default function BookSessionNavigation({
  bookStep,
  steps,
  currentStepIndex,
  currentStepValid,
  handlePrevStep,
  handleNextStep,
  mentor,
  handleCreateSession,
}: BookSessionNavigationProps) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      {currentStepIndex > 0 && (
        <Button variant="outline-white" onClick={handlePrevStep}>
          Back
        </Button>
      )}

      {bookStep !== BookStep.SCHEDULE &&
        currentStepIndex !== steps.length - 1 && (
          <Button
            className={clsx("", {
              "bg-dim border-dim pointer-events-none": !currentStepValid,
            })}
            disabled={!currentStepValid}
            onClick={handleNextStep}
          >
            Next
          </Button>
        )}

      {currentStepIndex === steps.length - 1 && (
        <CompleteSessionButton
          mentor={mentor}
          handleCreateSession={handleCreateSession}
        />
      )}
    </div>
  )
}
