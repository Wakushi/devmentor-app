"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import clsx from "clsx"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

// STEP 1 :
// Learning fields
// Experience level
// Learning goals

// STEP 2 :
// Language preferences
// Availability

// STEP 3 :
// Contact information

// Save button

const learningFormSchema = z.object({
  learningFields: z.array(z.string()).min(1, {
    message: "Please select at least one learning field.",
  }),
})

const learningFieldOptions = [
  { value: "blockchain", label: "Blockchain" },
  { value: "smart_contracts", label: "Smart Contracts" },
  { value: "defi", label: "DeFi" },
  { value: "nft", label: "NFTs" },
  { value: "web3_development", label: "Web3 Development" },
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "tokenomics", label: "Tokenomics" },
  { value: "dao", label: "DAOs" },
]

enum ProfileSteps {
  LEARNING = "LEARNING",
  LANGUAGE = "LANGUAGE",
  CONTACT = "CONTACT",
}

export default function ProfileCreationPage() {
  const [step, setStep] = useState<ProfileSteps>(ProfileSteps.LEARNING)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  type LearningFormValues = z.infer<typeof learningFormSchema>

  const form = useForm({
    resolver: zodResolver(learningFormSchema),
    defaultValues: {
      learningFields: [],
    },
  })

  const { watch } = useForm<LearningFormValues>({
    resolver: zodResolver(learningFormSchema),
    mode: "onChange",
  })

  function handleNextStep(): void {
    switch (step) {
      case ProfileSteps.LEARNING:
        setStep(ProfileSteps.LANGUAGE)
        break
      case ProfileSteps.LANGUAGE:
        setStep(ProfileSteps.CONTACT)
        break
      case ProfileSteps.CONTACT:
        setStep(ProfileSteps.CONTACT)
        break
    }

    console.log("selectedOptions: ", selectedOptions)
  }

  function handlePreviousStep(): void {
    switch (step) {
      case ProfileSteps.LANGUAGE:
        setStep(ProfileSteps.LEARNING)
        break
      case ProfileSteps.CONTACT:
        setStep(ProfileSteps.LANGUAGE)
        break
    }
  }

  async function onSubmit() {
    const formValues = watch()
    console.log("formValues: ", formValues)
  }

  return (
    <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
      <Card className="flex flex-col items-center justify-center min-w-[550px] gap-4 px-8 py-4 text-white text-start bg-white bg-opacity-[0.03] shadow-sm backdrop-blur-sm">
        <Stepper currentStep={step} />

        {step === ProfileSteps.LEARNING && (
          <div className="fade-in-bottom">
            <h2>Your Learning Journey</h2>
            <p>Let's tailor your experience to your interests and goals</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 my-4"
              >
                <FormField
                  control={form.control}
                  name="learningFields"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Fields</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={learningFieldOptions}
                          {...field}
                          onValueChange={setSelectedOptions}
                          defaultValue={selectedOptions}
                          placeholder="Select learning fields"
                          variant="default"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}

        {step === ProfileSteps.LANGUAGE && (
          <div className="fade-in-bottom">
            <h2>Customize Your Learning</h2>
            <p>Help us match you with the right mentors and resources</p>
          </div>
        )}

        {step === ProfileSteps.CONTACT && (
          <div className="fade-in-bottom">
            <h2>Stay Connected</h2>
            <p>Ensure you never miss an opportunity to learn and grow</p>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <Button variant="outline-white" onClick={handlePreviousStep}>
            Back
          </Button>
          <Button onClick={handleNextStep}>Next</Button>
        </div>
      </Card>
      <AnimatedBackground />
    </section>
  )
}

function Stepper({ currentStep }: { currentStep: ProfileSteps }) {
  const steps = Array.from(Object.keys(ProfileSteps) as ProfileSteps[])

  function currentStepIndex(): number {
    return steps.findIndex((step) => step === currentStep)
  }

  return (
    <div className="flex items-center gap-4">
      {steps.map((_, index) => {
        return (
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                "w-[40px] h-[40px] flex justify-center items-center  rounded-full",
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
                className={clsx("w-[140px] h-[10px] rounded-sm", {
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
