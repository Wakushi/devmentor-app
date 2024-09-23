"use client"
import Link from "next/link"
import { MdOutlineHandshake } from "react-icons/md"
import { ReactNode } from "react"
import clsx from "clsx"

export default function Header() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 rounded-xl w-[95%] flex items-center justify-between px-8 py-4 bg-white bg-opacity-[0.03] shadow-sm backdrop-blur-sm z-[10]">
      <Logo />
      <nav className="flex items-center gap-4">
        <NavLinkButton href="/">Home</NavLinkButton>
        <div className="flex items-center gap-2">
          <NavLinkButton href="/auth/signup" variant="outline">
            Signup
          </NavLinkButton>
          <NavLinkButton href="/auth/login" variant="filled">
            Login
          </NavLinkButton>
        </div>
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <div className="flex gap-1 items-center">
      <MdOutlineHandshake />
      <div className="font-heading font-bold text-2xl">devmentor</div>
    </div>
  )
}

function NavLinkButton({
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
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  text-white shadow-sm hover:opacity-80 h-9 px-4 py-2",
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
