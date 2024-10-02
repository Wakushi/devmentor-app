import { ContactType } from "@/lib/types/profile-form.type"
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { MdAlternateEmail } from "react-icons/md"
import clsx from "clsx"
import { IoIosClose } from "react-icons/io"

export default function ContactFields({
  selectedContacts,
  handleContactChange,
}: {
  selectedContacts: Map<ContactType, string>
  handleContactChange: (value: string, field: ContactType) => void
}) {
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

  function getContactByField(field: ContactType): string {
    return selectedContacts.get(field) || ""
  }

  return (
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
            <div className="border glass rounded-lg p-2">{icon}</div>
            <div className="relative w-full">
              <Input
                className="w-full"
                placeholder={placeholder}
                id={field}
                value={getContactByField(field)}
                onChange={(e) => handleContactChange(e.target.value, field)}
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
  )
}
