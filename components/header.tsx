"use client"
import Link from "next/link"
import { GiMountaintop } from "react-icons/gi"
import { useUser } from "@/services/user.service"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { getBalance } from "@/lib/actions/web3/helpers"
import { IoMdLogOut } from "react-icons/io"
import TooltipWrapper from "./ui/custom-tooltip"
import NavLinkButton from "./ui/nav-link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { usePathname } from "next/navigation"

export default function Header() {
  const { user, isConnected, disconnectWallet } = useUser()

  async function getUserBalance() {
    if (!web3AuthInstance.provider) return
    const balance = await getBalance(web3AuthInstance.provider, user?.address)
    console.log("Balance: ", balance)
    console.log("User: ", user)
  }

  function Navigation() {
    if (isConnected && user?.registered) {
      return (
        <nav className="flex items-center gap-8">
          <div className="flex items-center">
            <NavLinkButton variant="ghost" href="/">
              Home
            </NavLinkButton>
            <NavLinkButton variant="ghost" href="/dashboard">
              Dashboard
            </NavLinkButton>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-[30px] h-[30px]" onClick={getUserBalance}>
              <AvatarImage src={user?.web3AuthData?.profileImage} />
              <AvatarFallback className="text-d1">
                {user.name![0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-mid font-semibold">{user.name}</p>
            <TooltipWrapper message="Disconnect wallet">
              <IoMdLogOut
                className="text-2xl text-brand cursor-pointer hover:opacity-80"
                onClick={() => disconnectWallet()}
              />
            </TooltipWrapper>
          </div>
        </nav>
      )
    }

    return (
      <nav className="flex items-center gap-2">
        <NavLinkButton href="/">Home</NavLinkButton>
        <NavLinkButton href="/auth/signup" variant="outline">
          Signup
        </NavLinkButton>
        <NavLinkButton href="/auth/login" variant="filled">
          Login
        </NavLinkButton>
      </nav>
    )
  }

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 rounded-xl w-[95%] flex items-center justify-between px-8 py-4 glass z-[10]">
      <Logo />
      <Navigation />
    </header>
  )
}

function Logo() {
  return (
    <Link href="/" className="flex gap-1 items-center">
      <GiMountaintop className="text-3xl" />
      <div className="font-heading font-extralight text-2xl flex items-center drop-shadow-md">
        D<span className="text-secondary">EVM</span>ENTOR
      </div>
    </Link>
  )
}
