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
  ContactType,
  Experience,
  experienceDescriptions,
  Language,
  languageOptions,
  LearningField,
  learningFieldOptions,
  ProfileSteps,
} from "@/lib/types/profile-form.type"
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaLongArrowAltRight,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { MdAlternateEmail } from "react-icons/md"
import { IoIosClose } from "react-icons/io"
import Stepper from "@/components/pages/auth/stepper"
import { Separator } from "@/components/ui/separator"
import { User } from "@/lib/types/user.type"
import { useUser } from "@/services/user.service"
import Loader from "@/components/ui/loader"
import { CiCircleCheck } from "react-icons/ci"
import NavLinkButton from "@/components/ui/nav-link"

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

const contactOptions = [
  {
    placeholder: "Discord username",
    field: ContactType.DISCORD,
    icon: <FaDiscord />,
  },
  {
    placeholder: "Email address",
    field: ContactType.EMAIL,
    icon: <MdAlternateEmail />,
  },
  {
    placeholder: "Twitter handle",
    field: ContactType.TWITTER,
    icon: <FaTwitter />,
  },
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
    placeholder: "Telegram username",
    field: ContactType.TELEGRAM,
    icon: <FaTelegram />,
  },
]

export default function ProfileCreationPage() {
  const { user, setUser } = useUser()

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [step, setStep] = useState<ProfileSteps>(ProfileSteps.LEARNING)
  const [selectedContacts, setSelectedContacts] = useState<
    Map<ContactType, string>
  >(new Map())

  const steps = Array.from(Object.keys(ProfileSteps) as ProfileSteps[])

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
      case ProfileSteps.LEARNING:
        setStep(ProfileSteps.LANGUAGE)
        break
      case ProfileSteps.LANGUAGE:
        setStep(ProfileSteps.CONTACT)
        break
      case ProfileSteps.CONTACT:
        onSubmit()
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

  function handleContactChange(value: string, field: ContactType): void {
    setSelectedContacts((prevSelectedContacts) => {
      const newSelectedContacts = new Map(prevSelectedContacts)
      newSelectedContacts.set(field, value)
      return newSelectedContacts
    })
  }

  function getContactByField(field: ContactType): string {
    return selectedContacts.get(field) || ""
  }

  async function onSubmit() {
    if (!user || !user.address) return

    setLoading(true)

    try {
      const { learningFields, experience } = learningForm.getValues()
      const { languages } = languageForm.getValues()
      const contacts = Array.from(selectedContacts, ([field, value]) => ({
        type: field,
        value,
      }))

      const getUsername = (): string => {
        if (contacts.length === 1 && contacts[0].type === ContactType.EMAIL) {
          return contacts[0].value.split("@")[0]
        }
        return contacts[0].value
      }

      const userPayload: User = {
        ...user,
        name: getUsername(),
        learningFields,
        experience,
        languages,
        contacts,
      }

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      })

      const { createdUser } = await response.json()

      setUser(createdUser)

      setLoading(false)
      setSuccess(true)
    } catch (error) {
      setLoading(false)
      setSuccess(false)
    }
  }

  function currentStepIndex(): number {
    return steps.findIndex((s) => s === step)
  }

  function isCurrentStepValid(): boolean {
    switch (step) {
      case ProfileSteps.LEARNING:
        return learningForm.formState.isValid
      case ProfileSteps.LANGUAGE:
        return languageForm.formState.isValid
      case ProfileSteps.CONTACT:
        const contacts = Array.from(selectedContacts.values()).filter((v) => v)
        return !!contacts.length
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
        <div className="flex flex-col gap-4 justify-center items-center">
          <CiCircleCheck className="text-8xl text-success fade-in-bottom" />
          <div className="flex flex-col text-center">
            <h3>Account created with success !</h3>
            <p className="mb-4">
              Let's find a mentor to help you for your first session
            </p>
          </div>
          <NavLinkButton href="/dashboard" variant="filled">
            Go to dashboard <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      )
    }
  }

  return (
    <section className="min-h-screen flex flex-col gap-4 justify-center items-center text-center">
      <Card
        className={clsx(
          "flex flex-col items-center justify-center min-w-[500px] max-w-[580px] min-h-[550px] gap-8 p-8 text-white text-start glass",
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

            {step === ProfileSteps.LEARNING && (
              <div className="flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2 onClick={onSubmit}>Your Learning Journey</h2>
                  <p>
                    Let's tailor your experience to your interests and goals
                  </p>
                </div>
                <Form {...learningForm}>
                  <form className="space-y-2 my-4">
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

            {step === ProfileSteps.LANGUAGE && (
              <div className="w-full flex flex-col fade-in-bottom">
                <div className="mb-2">
                  <h2>Customize Your Learning</h2>
                  <p>Help us match you with the right mentors and resources</p>
                </div>
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
                                        watchLanguages.includes(lang.value),
                                      "border-gray-300 glass":
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
                                  <img
                                    src={`https://flagsapi.com/${lang.code}/flat/64.png`}
                                    alt={`${lang.label} flag`}
                                    className="w-12 h-12 object-cover rounded"
                                  />
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

            {step === ProfileSteps.CONTACT && (
              <div className="flex flex-col fade-in-bottom">
                <div className="mb-8">
                  <h2>Connect with mentors</h2>
                  <p>
                    Provide at least one way for your mentor to reach out to you
                  </p>
                </div>
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
