"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function NavLinkButton({
  href,
  children,
  target = "_self",
  text = "mid",
  variant = "ghost",
}: {
  href: string
  children: ReactNode
  target?: "_blank" | "_self"
  text?: "small" | "mid" | "body" | "large"
  variant?: "filled" | "filled-secondary" | "outline" | "ghost" | "accent"
}) {
  const pathname = usePathname()

  return (
    <Link
      className={clsx(
        "inline-flex w-full h-full items-center gap-2 justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  text-white hover:opacity-80 px-4 py-2",
        {
          "bg-primary border border-primary hover:bg-primary-shade hover:text-slate-50 active:bg-slate-50 active:text-primary shadow-sm ":
            variant === "filled",
          "bg-secondary border-secondary hover:bg-secondary-shade hover:text-slate-50 active:bg-slate-50 active:text-secondary shadow-sm ":
            variant === "filled-secondary",
          "bg-dm-accent border border-dm-accent hover:bg-dm-accent hover:text-slate-50 active:bg-slate-50 active:text-dm-accent shadow-sm ":
            variant === "accent",
          "border border-white bg-transparent shadow-sm ":
            variant === "outline",
          "bg-transparent shadow-none underline-offset-4 hover:underline":
            variant === "ghost",
          "text-body": text === "body",
          "text-small": text === "small",
          "text-heading": text === "large",
          "text-mid": text === "mid",
          underline: pathname === href && variant === "ghost",
        }
      )}
      href={href}
      target={target}
    >
      {children}
    </Link>
  )
}
