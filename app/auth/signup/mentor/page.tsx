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
  allSubjects,
  ContactType,
  Language,
  languageOptions,
  LearningField,
  learningFieldOptions,
  MentorSignUpSteps,
} from "@/lib/types/profile-form.type"
import {
  FaGithub,
  FaLinkedin,
  FaLongArrowAltRight,
  FaTwitter,
} from "react-icons/fa"
import { Input } from "@/components/ui/input"
import Stepper from "@/components/pages/auth/stepper"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/services/user.service"
import Loader from "@/components/ui/loader"
import NavLinkButton from "@/components/ui/nav-link"
import Flag from "@/components/ui/flag"
import SuccessScreen from "@/components/success-screen"
import { useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { IoIosClose } from "react-icons/io"
import { registerMentor } from "@/lib/actions/web3/contract"
import { BaseUser } from "@/lib/types/user.type"

const identityFormSchema = z.object({
  name: z.string().min(3, "Minimum length is 3"),
  yearsOfExperience: z.coerce.number().min(1),
  learningFields: z
    .array(z.nativeEnum(LearningField))
    .min(1, "Please select at least one teaching field"),
})

const languageFormSchema = z.object({
  languages: z
    .array(z.nativeEnum(Language))
    .min(1, "Please select at least one language"),
})

const rateLinksFormSchema = z.object({
  hourlyRate: z.string(),
})

const contactOptions = [
  {
    placeholder: "LinkedIn profile",
    field: ContactType.LINKEDIN,
    icon: <FaLinkedin />,
  },
  {
    placeholder: "GitHub username",
    field: ContactType.GITHUB,
    icon: <FaGithub />,
  },
  {
    placeholder: "Twitter handle",
    field: ContactType.TWITTER,
    icon: <FaTwitter />,
  },
]

export default function MentorSignUpPage() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [step, setStep] = useState<MentorSignUpSteps>(
    MentorSignUpSteps.IDENTITY
  )
  const [selectedContacts, setSelectedContacts] = useState<
    Map<ContactType, string>
  >(new Map())

  const steps = Array.from(
    Object.keys(MentorSignUpSteps) as MentorSignUpSteps[]
  )

  type LearningFormValues = z.infer<typeof identityFormSchema>
  type LanguageFormValues = z.infer<typeof languageFormSchema>
  type RateLinksFormValues = z.infer<typeof rateLinksFormSchema>

  const identityForm = useForm<LearningFormValues>({
    resolver: zodResolver(identityFormSchema),
    defaultValues: {
      name: "",
      yearsOfExperience: 1,
      learningFields: [],
    },
  })

  const languageForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      languages: [],
    },
  })

  const rateAndLinksForm = useForm<RateLinksFormValues>({
    resolver: zodResolver(rateLinksFormSchema),
    defaultValues: {
      hourlyRate: "0",
    },
  })

  const watchLanguages = languageForm.watch("languages")
  const watchHourlyRate = rateAndLinksForm.watch("hourlyRate")

  function getContactByField(field: ContactType): string {
    return selectedContacts.get(field) || ""
  }

  function handleContactChange(value: string, field: ContactType): void {
    setSelectedContacts((prevSelectedContacts) => {
      const newSelectedContacts = new Map(prevSelectedContacts)
      newSelectedContacts.set(field, value)
      return newSelectedContacts
    })
  }

  function handleNextStep(): void {
    switch (step) {
      case MentorSignUpSteps.IDENTITY:
        setStep(MentorSignUpSteps.LANGUAGE)
        break
      case MentorSignUpSteps.LANGUAGE:
        setStep(MentorSignUpSteps.CREDENTIALS)
        break
      case MentorSignUpSteps.CREDENTIALS:
        onSubmit()
        break
    }
  }

  function handlePreviousStep(): void {
    switch (step) {
      case MentorSignUpSteps.LANGUAGE:
        setStep(MentorSignUpSteps.IDENTITY)
        break
      case MentorSignUpSteps.CREDENTIALS:
        setStep(MentorSignUpSteps.LANGUAGE)
        break
    }
  }

  function currentStepIndex(): number {
    return steps.findIndex((s) => s === step)
  }

  function isCurrentStepValid(): boolean {
    switch (step) {
      case MentorSignUpSteps.IDENTITY:
        return identityForm.formState.isValid
      case MentorSignUpSteps.LANGUAGE:
        return languageForm.formState.isValid
      case MentorSignUpSteps.CREDENTIALS:
        const contacts = Array.from(selectedContacts.values()).filter((v) => v)
        const hourlyRate = Number(watchHourlyRate)
        return (
          !!contacts.length &&
          !Number.isNaN(hourlyRate) &&
          hourlyRate >= 0 &&
          hourlyRate < 1000
        )
      default:
        return false
    }
  }

  async function onSubmit() {
    if (!user || !user.account) return

    setLoading(true)

    try {
      const { name, learningFields, yearsOfExperience } =
        identityForm.getValues()
      const { languages } = languageForm.getValues()
      const { hourlyRate } = rateAndLinksForm.getValues()

      const languagesIds = languages.map((lang) => {
        const langId = languages.findIndex((l) => l === lang)
        return langId >= 0 ? langId : 0
      })

      const subjectsIds = learningFields.map((subject) => {
        const subjectId = allSubjects.findIndex((s) => s === subject)
        return subjectId >= 0 ? subjectId : 0
      })

      const baseUser: BaseUser = {
        account: user.account,
        userName: name,
        languages: languagesIds,
        subjects: subjectsIds,
      }

      const userPayload = {
        account: user.account,
        baseUser,
        yearsOfExperience: +yearsOfExperience,
        hourlyRate: +hourlyRate,
      }

      await registerMentor(userPayload)

      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      })

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER, user.account],
      })

      setLoading(false)
      setSuccess(true)
    } catch (error) {
      setLoading(false)
      setSuccess(false)
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
          subtitle="Let's discover your dashboard and update your availabilties"
        >
          <div className="max-w-[300px]">
            <NavLinkButton href="/dashboard/mentor" variant="filled">
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
          "flex flex-col items-center justify-center min-w-[500px] max-w-[580px] min-h-[550px] border-stone-800 gap-8 p-8 text-white text-start glass",
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

            {step === MentorSignUpSteps.IDENTITY && (
              <div className="flex flex-col w-full justify-start fade-in-bottom">
                <div className="mb-2">
                  <h2 className="leading-tight">
                    Forge the next generation of developers
                  </h2>
                  <p className="text-dim">
                    Share your expertise and passion with us
                  </p>
                </div>
                <Form {...identityForm}>
                  <form
                    className="space-y-2 my-4"
                    onSubmit={identityForm.handleSubmit(onSubmit)}
                  >
                    {/* NAME */}
                    <FormField
                      control={identityForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Patrick Collins" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* YEARS OF EXPERIENCE */}
                    <FormField
                      control={identityForm.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of experience</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your years of experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2">2 years</SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="4">4 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                              <SelectItem value="6">6 years</SelectItem>
                              <SelectItem value="7">7+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TEACHING FIELDS */}
                    <FormField
                      control={identityForm.control}
                      name="learningFields"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Which fields do you want to teach?
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
                  </form>
                </Form>
              </div>
            )}

            {step === MentorSignUpSteps.LANGUAGE && (
              <div className="w-full flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2>Breaking Language Barriers</h2>
                  <p className="text-dim">
                    Tell us which languages you speak fluently
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

            {step === MentorSignUpSteps.CREDENTIALS && (
              <div className="w-full flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2>Showcase Your Value</h2>
                  <p className="text-dim">
                    Set your rate and share your digital footprint
                  </p>
                </div>
                <Form {...rateAndLinksForm}>
                  <form
                    className="space-y-4 my-4"
                    onSubmit={identityForm.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={rateAndLinksForm.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate (USD)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your hourly rate"
                            />
                          </FormControl>
                          <FormDescription>
                            Leave the field empty if you don't want to apply
                            fees (You can always update this later.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <p className="form-label mb-4">
                  Share your GitHub, LinkedIn, or portfolio URL to help us
                  verify your experience and approve your candidature.
                </p>
                <div className="flex flex-col gap-2">
                  {contactOptions.map(({ placeholder, field, icon }) => {
                    return (
                      <div
                        key={field}
                        className={clsx("flex gap-2", {
                          "opacity-60": !!!getContactByField(field),
                          "opacity-100": !!getContactByField(field),
                        })}
                      >
                        <div className="border glass rounded-lg p-2">
                          {icon}
                        </div>
                        <div className="relative w-full">
                          <Input
                            className="w-full"
                            placeholder={placeholder}
                            id={field}
                            value={getContactByField(field)}
                            onChange={(e) =>
                              handleContactChange(e.target.value, field)
                            }
                          ></Input>
                          {!!getContactByField(field) && (
                            <IoIosClose
                              onClick={() => handleContactChange("", field)}
                              className="text-2xl opacity-70 hover:opacity-100 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[0.8rem] text-dim mt-2">
                  These won't be shared with anyone and will be deleted after
                  your candidature is reviewed.
                </p>
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
