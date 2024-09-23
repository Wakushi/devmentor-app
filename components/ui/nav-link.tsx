import clsx from "clsx"
import Link from "next/link"
import { ReactNode } from "react"

export default function NavLinkButton({
  href,
  children,
  variant = "ghost",
}: {
  href: string
  children: ReactNode
  variant?: "filled" | "outline" | "ghost"
}) {
  return (
    <Link
      className={clsx(
        "inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  text-white shadow-sm hover:opacity-80 h-9 px-4 py-2",
        {
          "bg-primary border-primary hover:bg-primary-shade hover:text-slate-50 active:bg-slate-50 active:text-primary":
            variant === "filled",
          "border border-white bg-transparent": variant === "outline",
          "bg-transparent shadow-none underline-offset-4 hover:underline":
            variant === "ghost",
        }
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
