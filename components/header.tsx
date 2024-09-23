"use client"
import Link from "next/link"
import { MdOutlineHandshake } from "react-icons/md"
import { ReactNode } from "react"
import clsx from "clsx"
import { useUser } from "@/services/user.service"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { getBalance } from "@/lib/actions/web3/helpers"
import { shortenAddress } from "@/lib/utils"
import { IoMdLogOut } from "react-icons/io"
import TooltipWrapper from "./ui/custom-tooltip"
import NavLinkButton from "./ui/nav-link"

export default function Header() {
  const { user, isConnected, disconnectWallet } = useUser()

  async function getUserBalance() {
    if (!web3AuthInstance.provider) return
    const balance = await getBalance(web3AuthInstance.provider, user?.address)
    console.log("Balance: ", balance)
    console.log("User: ", user)
  }

  function Navigation() {
    if (isConnected && user) {
      return (
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
      </div>
    )
  }

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 rounded-xl w-[95%] flex items-center justify-between px-8 py-4 glass z-[10]">
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
    <Link href="/" className="flex gap-1 items-center">
      <MdOutlineHandshake />
      <div className="font-heading font-bold text-2xl">devmentor</div>
    </Link>
  )
}
