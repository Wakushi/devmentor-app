import { MdError } from "react-icons/md"
import NavLinkButton from "./ui/nav-link"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function ErrorScreen({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="flex flex-col gap-4 justify-center items-center">
        <MdError className="text-8xl text-destructive fade-in-bottom" />
        <div className="flex flex-col text-center">
          <h3>{title}</h3>
          <p className="mb-4 text-dim">{subtitle}</p>
        </div>
        <div className="max-w-[300px] flex flex-col gap-2 w-full">
          <NavLinkButton href="/" variant="outline">
            Go to home page <FaLongArrowAltRight />
          </NavLinkButton>
        </div>
      </div>
    </div>
  )
}
