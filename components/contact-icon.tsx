import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa"
import { ContactType } from "@/lib/types/profile-form.type"
import { MdAlternateEmail } from "react-icons/md"
import { User2Icon } from "lucide-react"

export default function ContactIcon({ type }: { type: ContactType }) {
  switch (type) {
    case ContactType.DISCORD:
      return <FaDiscord />
    case ContactType.EMAIL:
      return <MdAlternateEmail />
    case ContactType.TWITTER:
      return <FaTwitter />
    case ContactType.LINKEDIN:
      return <FaLinkedin />
    case ContactType.GITHUB:
      return <FaGithub />
    case ContactType.TELEGRAM:
      return <FaTelegram />
    default:
      return <User2Icon />
  }
}
