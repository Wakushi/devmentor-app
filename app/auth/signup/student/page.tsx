"use client"

import AnimatedBackground from "@/components/ui/animated-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import clsx from "clsx"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/hooks/use-toast"
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
  ContactType,
  Experience,
  experienceDescriptions,
  experiences,
  Language,
  languageOptions,
  LearningField,
  learningFieldOptions,
  StudentSignUpSteps,
  allSubjects,
} from "@/lib/types/profile-form.type"
import { FaLongArrowAltRight } from "react-icons/fa"
import Stepper from "@/components/pages/auth/stepper"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/services/user.service"
import Loader from "@/components/ui/loader"
import NavLinkButton from "@/components/ui/nav-link"
import { Role } from "@/lib/types/role.type"
import Flag from "@/components/ui/flag"
import SuccessScreen from "@/components/success-screen"
import { useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { encryptForAddress } from "@/lib/crypto"
import {
  ContractEvent,
  registerStudent,
  watchForEvent,
} from "@/lib/actions/web3/contract"
import { BaseUser } from "@/lib/types/user.type"
import ContactFields from "@/components/pages/auth/contact-fields"
import { FaCircleCheck } from "react-icons/fa6"
import { Address } from "viem"

const learningFormSchema = z.object({
  learningFields: z
    .array(z.nativeEnum(LearningField))
    .min(1, "Please select at least one learning field"),
  experience: z.nativeEnum(Experience),
})

const languageFormSchema = z.object({
  languages: z
    .array(z.nativeEnum(Language))
    .min(1, "Please select at least one language"),
})

export default function StudentSignUpPage() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [step, setStep] = useState<StudentSignUpSteps>(
    StudentSignUpSteps.LEARNING
  )
  const [selectedContacts, setSelectedContacts] = useState<
    Map<ContactType, string>
  >(new Map())

  const steps = Array.from(
    Object.keys(StudentSignUpSteps) as StudentSignUpSteps[]
  )

  type LearningFormValues = z.infer<typeof learningFormSchema>
  type LanguageFormValues = z.infer<typeof languageFormSchema>

  const learningForm = useForm<LearningFormValues>({
    resolver: zodResolver(learningFormSchema),
    defaultValues: {
      learningFields: [],
      experience: Experience.NOVICE,
    },
  })

  const languageForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      languages: [],
    },
  })

  const watchExperience = learningForm.watch("experience")
  const watchLanguages = languageForm.watch("languages")

  function handleNextStep(): void {
    switch (step) {
      case StudentSignUpSteps.LEARNING:
        setStep(StudentSignUpSteps.LANGUAGE)
        break
      case StudentSignUpSteps.LANGUAGE:
        setStep(StudentSignUpSteps.CONTACT)
        break
      case StudentSignUpSteps.CONTACT:
        onSubmit()
        break
    }
  }

  function handlePreviousStep(): void {
    switch (step) {
      case StudentSignUpSteps.LANGUAGE:
        setStep(StudentSignUpSteps.LEARNING)
        break
      case StudentSignUpSteps.CONTACT:
        setStep(StudentSignUpSteps.LANGUAGE)
        break
    }
  }

  function handleContactChange(value: string, field: ContactType): void {
    setSelectedContacts((prevSelectedContacts) => {
      const newSelectedContacts = new Map(prevSelectedContacts)
      newSelectedContacts.set(field, value)
      return newSelectedContacts
    })
  }

  function currentStepIndex(): number {
    return steps.findIndex((s) => s === step)
  }

  function isCurrentStepValid(): boolean {
    switch (step) {
      case StudentSignUpSteps.LEARNING:
        return learningForm.formState.isValid
      case StudentSignUpSteps.LANGUAGE:
        return languageForm.formState.isValid
      case StudentSignUpSteps.CONTACT:
        const contacts = Array.from(selectedContacts.values()).filter((v) => v)
        return !!contacts.length
    }
  }

  async function onSubmit() {
    setLoading(true)

    try {
      if (!user || !user.account) {
        throw new Error("Missing user")
      }

      const userPayload = await createUserPayload()

      if (!userPayload) {
        throw new Error("Missing user payload")
      }

      toast({
        title: "Pending account creation...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      await registerStudent(userPayload)

      toast({
        title: "Creating account...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      watchForEvent({
        event: ContractEvent.STUDENT_REGISTERED,
        args: { account: user.account },
        handler: async () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.USER],
          })

          toast({
            title: "Success",
            description: "Account created successfully !",
            action: <FaCircleCheck className="text-white" />,
          })

          await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPayload, role: Role.STUDENT }),
          })

          setLoading(false)
          setSuccess(true)
        },
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Error submitting account. Please try again." + JSON.stringify(error),
        variant: "destructive",
      })
      setLoading(false)
      setSuccess(false)
    }
  }

  async function createUserPayload(): Promise<{
    account: Address
    baseUser: BaseUser
    contactHash: string
    experience: number
  } | null> {
    if (!user) return null

    const { learningFields, experience } = learningForm.getValues()
    const { languages } = languageForm.getValues()

    const contacts = Array.from(selectedContacts, ([field, value]) => ({
      type: field,
      value,
    })).filter((contact) => contact.value)

    const getUsername = (): string => {
      if (contacts.length === 1 && contacts[0].type === ContactType.EMAIL) {
        return contacts[0].value.split("@")[0]
      }
      return contacts[0].value
    }

    const contactHash = await encryptForAddress(
      JSON.stringify(contacts),
      user.account
    )

    const languagesIds = languages.map((lang) => {
      const langId = languages.findIndex((l) => l === lang)
      return langId >= 0 ? langId : 0
    })

    const subjectsIds = learningFields.map((subject) => {
      const subjectId = allSubjects.findIndex((s) => s === subject)
      return subjectId >= 0 ? subjectId : 0
    })

    const experienceNumber = experiences.findIndex((xp) => xp === experience)

    const baseUser: BaseUser = {
      account: user.account,
      userName: getUsername(),
      languages: languagesIds,
      subjects: subjectsIds,
    }

    return {
      account: user.account,
      baseUser,
      contactHash,
      experience: experienceNumber >= 0 ? experienceNumber : 0,
    }
  }

  function RenderContent() {
    if (loading) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center">
          <p>Validating account...</p>
          <Loader />
        </div>
      )
    }

    if (success) {
      return (
        <SuccessScreen
          title="Account created with success !"
          subtitle="Let's find a mentor to help you for your first session"
        >
          <div className="max-w-[300px]">
            <NavLinkButton href="/dashboard/student" variant="filled">
              Go to dashboard <FaLongArrowAltRight />
            </NavLinkButton>
          </div>
        </SuccessScreen>
      )
    }
  }

  return (
    <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
      <Card
        className={clsx(
          "flex flex-col items-center justify-center min-w-[500px] max-w-[580px] min-h-[550px] gap-8 p-8 text-white border-stone-800 text-start glass",
          {
            "fade-out-card": success,
          }
        )}
      >
        {loading || success ? (
          <RenderContent />
        ) : (
          <>
            <Stepper steps={steps} currentStep={step} />
            <Separator className="opacity-30" />

            {step === StudentSignUpSteps.LEARNING && (
              <div className="flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2>Your Learning Journey</h2>
                  <p className="text-dim">
                    Let's tailor your experience to your interests and goals
                  </p>
                </div>
                <Form {...learningForm}>
                  <form
                    className="space-y-2 my-4"
                    onSubmit={learningForm.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={learningForm.control}
                      name="learningFields"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Which domains do you want to master?
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={learningFieldOptions}
                              onValueChange={(value) =>
                                field.onChange(value as LearningField[])
                              }
                              defaultValue={field.value}
                              placeholder="Select learning fields"
                              variant="default"
                              animation={2}
                              maxCount={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

            {step === StudentSignUpSteps.LANGUAGE && (
              <div className="w-full flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2>Customize Your Learning</h2>
                  <p className="text-dim">
                    Help us match you with the right mentors and resources
                  </p>
                </div>
                <Form {...languageForm}>
                  <form
                    className="space-y-4 my-4"
                    onSubmit={(e) => e.preventDefault()}
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
                                    "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-all",
                                    {
                                      "border-primary bg-primary  bg-opacity-20":
                                        watchLanguages.includes(lang.value),
                                      "border-gray-300 glass hover:bg-primary-faded":
                                        !watchLanguages.includes(lang.value),
                                    }
                                  )}
                                  onClick={() => {
                                    const updatedLanguages =
                                      watchLanguages.includes(lang.value)
                                        ? watchLanguages.filter(
                                            (l) => l !== lang.value
                                          )
                                        : [...watchLanguages, lang.value]
                                    field.onChange(updatedLanguages)
                                  }}
                                >
                                  <Flag lang={lang} />
                                  <span className="mt-2 text-sm">
                                    {lang.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Click on the flags to select your preferred
                            languages.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            )}

            {step === StudentSignUpSteps.CONTACT && (
              <div className="flex flex-col fade-in-bottom">
                <div className="mb-8">
                  <h2>Connect with mentors</h2>
                  <p className="text-dim">
                    Provide at least one way for your mentor to reach out to you
                  </p>
                </div>
                <ContactFields
                  selectedContacts={selectedContacts}
                  handleContactChange={handleContactChange}
                />
              </div>
            )}

            <div className="flex items-center gap-4 ml-auto">
              {currentStepIndex() > 0 && (
                <Button variant="outline-white" onClick={handlePreviousStep}>
                  Back
                </Button>
              )}
              <Button
                className={clsx("", {
                  "bg-dim border-dim pointer-events-none":
                    !isCurrentStepValid(),
                })}
                disabled={!isCurrentStepValid()}
                onClick={handleNextStep}
              >
                {currentStepIndex() === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </>
        )}
      </Card>
      <AnimatedBackground shader={false} />
    </section>
  )
}
