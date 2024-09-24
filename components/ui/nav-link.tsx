import clsx from "clsx"
import Link from "next/link"
import { ReactNode } from "react"

export default function NavLinkButton({
  href,
  children,
  text = "small",
  variant = "ghost",
}: {
  href: string
  children: ReactNode
  text?: "small" | "body" | "large"
  variant?: "filled" | "outline" | "ghost"
}) {
  return (
    <Link
      className={clsx(
        "inline-flex w-full h-full items-center gap-2 justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  text-white shadow-sm hover:opacity-80 px-4 py-2",
        {
          "bg-primary border-primary hover:bg-primary-shade hover:text-slate-50 active:bg-slate-50 active:text-primary":
            variant === "filled",
          "border border-white bg-transparent": variant === "outline",
          "bg-transparent shadow-none underline-offset-4 hover:underline":
            variant === "ghost",
          "text-body": text === "body",
          "text-small": text === "small",
          "text-heading": text === "large",
        }
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
