import clsx from "clsx"

export default function Stepper({
  steps,
  currentStep,
}: {
  steps: any[]
  currentStep: any
}) {
  function currentStepIndex(): number {
    return steps.findIndex((step) => step === currentStep)
  }

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        return (
          <div key={step} className="flex items-center gap-4">
            <div
              className={clsx(
                "w-[40px] h-[40px] flex justify-center items-center rounded-full",
                {
                  "bg-primary text-white": currentStepIndex() >= index,
                  "bg-l1 text-d1": currentStepIndex() < index,
                }
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx("w-[160px] h-[10px] rounded-sm", {
                  "bg-primary": currentStepIndex() > index,
                  "bg-l1": currentStepIndex() <= index,
                })}
              ></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
