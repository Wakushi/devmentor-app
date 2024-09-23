"use client"
import Link from "next/link"
import { MdOutlineHandshake } from "react-icons/md"
import { ReactNode } from "react"
import clsx from "clsx"
import { useUser } from "@/services/user.service"
import { Button } from "./ui/button"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { getBalance } from "@/lib/actions/web3/helpers"
import { shortenAddress } from "@/lib/utils"
import { IoMdLogOut } from "react-icons/io"
import TooltipWrapper from "./ui/custom-tooltip"

export default function Header() {
  const { user, isConnected, disconnectWallet } = useUser()

  async function getUserBalance() {
    if (!web3AuthInstance.provider) return
    const balance = await getBalance(web3AuthInstance.provider, user?.address)
    console.log("Balance: ", balance)
  }

  function Navigation() {
    if (isConnected) {
      return (
        <>
          <Button onClick={() => disconnectWallet()}>Logout</Button>
        </>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <NavLinkButton href="/auth/signup" variant="outline">
          Signup
        </NavLinkButton>
        <NavLinkButton href="/auth/login" variant="filled">
          Login
        </NavLinkButton>
        {user && (
          <>
            <div
              onClick={() => {
                getUserBalance()
              }}
              className="text-white bg-brand px-4 py-2 rounded-md shadow hover:text-brand hover:bg-white cursor-pointer"
            >
              {shortenAddress(user.address)}
            </div>
            <TooltipWrapper message="Disconnect wallet">
              <IoMdLogOut
                className="text-2xl text-brand cursor-pointer hover:opacity-80"
                onClick={() => disconnectWallet()}
              />
            </TooltipWrapper>
          </>
        )}
      </div>
    )
  }

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 rounded-xl w-[95%] flex items-center justify-between px-8 py-4 bg-white bg-opacity-[0.03] shadow-sm backdrop-blur-sm z-[10]">
      <Logo />
      <nav className="flex items-center gap-4">
        <NavLinkButton href="/">Home</NavLinkButton>
        <Navigation />
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
