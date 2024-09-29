import clsx from "clsx"

export default function Stepper({
  steps,
  currentStep,
  handleStepClick = () => {},
}: {
  steps: any[]
  currentStep: any
  handleStepClick?: (step: any) => void
}) {
  function currentStepIndex(): number {
    return steps.findIndex((step) => step === currentStep)
  }

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        return (
          <div
            key={step}
            className="flex items-center gap-4"
            onClick={() => handleStepClick(step)}
          >
            <StepBubble index={index} currentStepIndex={currentStepIndex()} />
            {index < steps.length - 1 && (
              <StepJunctionBar
                index={index}
                currentStepIndex={currentStepIndex()}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepBubble({
  index,
  currentStepIndex,
}: {
  index: number
  currentStepIndex: number
}) {
  return (
    <div
      className={clsx(
        "w-[40px] h-[40px] flex select-none justify-center items-center rounded-full",
        {
          "bg-primary text-white hover:bg-primary-shade cursor-pointer":
            currentStepIndex >= index,
          "bg-l1 text-d1 opacity-40": currentStepIndex < index,
        }
      )}
    >
      {index + 1}
    </div>
  )
}

function StepJunctionBar({
  index,
  currentStepIndex,
}: {
  index: number
  currentStepIndex: number
}) {
  return (
    <div
      className={clsx("w-[160px] h-[10px] rounded-sm", {
        "bg-primary": currentStepIndex > index,
        "bg-l1 opacity-40": currentStepIndex <= index,
      })}
    ></div>
  )
}
