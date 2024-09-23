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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Experience,
  experienceDescriptions,
  languageOptions,
  learningFieldOptions,
  ProfileSteps,
} from "@/lib/types/profile-form.type"

const learningFormSchema = z.object({
  experience: z.nativeEnum(Experience),
})

const languageFormSchema = z.object({
  languages: z.array(z.string()).min(1, "Please select at least one language"),
})

export default function ProfileCreationPage() {
  const [step, setStep] = useState<ProfileSteps>(ProfileSteps.LEARNING)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  type LearningFormValues = z.infer<typeof learningFormSchema>

  const learningForm = useForm({
    resolver: zodResolver(learningFormSchema),
    defaultValues: {
      experience: Experience.NOVICE,
    },
  })

  const languageForm = useForm({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      languages: [],
    },
  })

  const watchExperience = learningForm.watch("experience")

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
      <Card className="flex flex-col items-center justify-center min-w-[500px] max-w-[580px] gap-4 p-8 text-white text-start bg-white bg-opacity-[0.03] shadow-sm backdrop-blur-sm">
        <Stepper currentStep={step} />

        {step === ProfileSteps.LEARNING && (
          <div>
            <div className="flex flex-col fade-in-bottom">
              <h2>Your Learning Journey</h2>
              <p>Let's tailor your experience to your interests and goals</p>
            </div>
            <Form {...learningForm}>
              <form
                onSubmit={learningForm.handleSubmit(onSubmit)}
                className="space-y-2 my-4"
              >
                <FormItem>
                  <FormLabel>Which domains do you want to master ?</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={learningFieldOptions}
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

                <FormField
                  control={learningForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How would you describe your journey so far ?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(experienceDescriptions).map(
                            ([value, { label }]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {watchExperience && (
                        <FormDescription>
                          {
                            experienceDescriptions[
                              watchExperience as Experience
                            ].description
                          }
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}

        {step === ProfileSteps.LANGUAGE && (
          <div className="fade-in-bottom w-full">
            <h2>Customize Your Learning</h2>
            <p>Help us match you with the right mentors and resources</p>
            <Form {...languageForm}>
              <form
                onSubmit={languageForm.handleSubmit(onSubmit)}
                className="space-y-4 my-4"
              >
                <FormField
                  control={languageForm.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select your preferred languages</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-5 gap-4">
                          {languageOptions.map((lang) => (
                            <div
                              key={lang.value}
                              className={clsx(
                                "flex flex-col items-center p-2 border rounded-xl cursor-pointer transition-all",
                                {
                                  "border-primary bg-primary bg-opacity-20":
                                    selectedLanguages.includes(lang.value),
                                  "border-gray-300 bg-white bg-opacity-[0.03] shadow-sm backdrop-blur-sm":
                                    !selectedLanguages.includes(lang.value),
                                }
                              )}
                              onClick={() => {
                                const updatedLanguages =
                                  selectedLanguages.includes(lang.value)
                                    ? selectedLanguages.filter(
                                        (l) => l !== lang.value
                                      )
                                    : [...selectedLanguages, lang.value]
                                setSelectedLanguages(updatedLanguages)
                                field.onChange(updatedLanguages)
                              }}
                            >
                              <img
                                src={`https://flagsapi.com/${lang.code}/flat/64.png`}
                                alt={`${lang.label} flag`}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="mt-2 text-sm">{lang.label}</span>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Click on the flags to select your preferred languages.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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
      <AnimatedBackground shader={false} />
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
