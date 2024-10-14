"use client"
import Link from "next/link"
import { GiMountaintop } from "react-icons/gi"
import { useUser } from "@/stores/user.store"
import { IoMdLogOut } from "react-icons/io"
import TooltipWrapper from "./ui/custom-tooltip"
import NavLinkButton from "./ui/nav-link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/lib/utils"
import { Role } from "@/lib/types/role.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import { getBalance } from "@/services/contract.service"

export default function Header() {
  const { user, isConnected, logOut, loadingUser } = useUser()

  const getUserBalance = async () => {
    if (!web3AuthInstance.provider || !user?.account) return
    const balance = await getBalance(web3AuthInstance.provider, user.account)
    console.log("Balance: ", balance, "User: ", user)
  }

  type NavLinkVariant = "ghost" | "filled" | "filled-secondary" | "outline"
  type NavLink = {
    href: string
    label: string
    variant?: NavLinkVariant
  }

  const renderNavLinks = (links: NavLink[]) =>
    links.map(({ href, label, variant = "ghost" }) => (
      <NavLinkButton key={href} variant={variant} href={href}>
        {label}
      </NavLinkButton>
    ))

  const Navigation = () => {
    if (
      isConnected &&
      user &&
      (user.role === Role.MENTOR || user.role === Role.STUDENT)
    ) {
      const navLinks = [
        { href: `/${user.role?.toLowerCase()}/dashboard`, label: "Dashboard" },
      ]

      if (user.role === Role.STUDENT) {
        navLinks.push({ href: "/student/mentor-search", label: "Mentors" })
      }

      if (user.role === Role.MENTOR) {
        navLinks.push(
          {
            href: "/mentor/session-requests",
            label: "Session requests",
          },
          {
            href: "/mentor/availability",
            label: "Availability",
          }
        )
      }

      return (
        <nav className="flex items-center gap-8">
          <div className="flex items-center">{renderNavLinks(navLinks)}</div>
          <div className="flex items-center gap-2">
            <Avatar className="w-[30px] h-[30px]" onClick={getUserBalance}>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${
                  (user as Student | Mentor).baseUser.userName
                }`}
              />
              <AvatarFallback className="text-d1">
                {getInitials(
                  (user as Student | Mentor).baseUser.userName || ""
                )}
              </AvatarFallback>
            </Avatar>
            <p className="text-mid">
              {(user as Student | Mentor).baseUser.userName}
            </p>
            <TooltipWrapper message="Disconnect wallet">
              <IoMdLogOut
                className="text-2xl text-brand cursor-pointer hover:opacity-80"
                onClick={logOut}
              />
            </TooltipWrapper>
          </div>
        </nav>
      )
    }

    const authLinks: NavLink[] = [
      { href: "/", label: "Home" },
      { href: "/auth/signup", label: "Signup", variant: "outline" },
      { href: "/auth/login", label: "Login", variant: "filled" },
    ]

    return (
      <nav className="flex items-center gap-2">
        {renderNavLinks(authLinks)}
        {isConnected && (
          <TooltipWrapper message="Disconnect wallet">
            <IoMdLogOut
              className="text-2xl text-brand cursor-pointer hover:opacity-80"
              onClick={logOut}
            />
          </TooltipWrapper>
        )}
      </nav>
    )
  }

  const Logo = () => (
    <Link href="/" className="flex gap-1 items-center">
      <GiMountaintop className="text-3xl" />
      <div className="font-heading font-light text-2xl flex items-center drop-shadow-md">
        D<span className="text-primary-light">EVM</span>ENTOR
      </div>
    </Link>
  )

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 rounded-md w-[95%] flex items-center justify-between px-8 py-4 glass z-[10]">
      <Logo />
      {!loadingUser && <Navigation />}
    </header>
  )
}
