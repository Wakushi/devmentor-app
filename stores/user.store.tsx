"use client"
import { createContext, ReactNode, useContext, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { Mentor, Student, Visitor } from "@/lib/types/user.type"
import { Address } from "viem"
import { Role } from "@/lib/types/role.type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { BASE_USER_PATH } from "@/lib/constants"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: Visitor | Student | Mentor | null | undefined
  loadingUser: boolean
  isConnected: boolean
  logOut: () => void
}

enum Connectors {
  WEB3AUTH = "Web3Auth",
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loadingUser: false,
  isConnected: false,
  logOut: () => {},
})

export default function UserContextProvider(props: UserContextProviderProps) {
  const { address, connector, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading: loadingUser } = useQuery<
    Visitor | Student | Mentor | null,
    Error
  >({
    queryKey: [QueryKeys.USER],
    queryFn: () => fetchUser(),
  })

  useEffect(() => {
    if (!isConnected && !web3AuthInstance.connected) return

    queryClient.refetchQueries({ queryKey: [QueryKeys.USER] })
  }, [web3AuthInstance.connected, isConnected])

  async function fetchUser(): Promise<Visitor | Student | Mentor | null> {
    if (!isConnected) return null

    try {
      let user: Visitor | Student | Mentor | null = null

      switch (connector?.name) {
        case Connectors.WEB3AUTH:
          if (!web3AuthInstance.connected || !address) return null

          user = await getUserByAddress(address)
          break

        default:
          if (!address) return null

          user = await getUserByAddress(address)
          break
      }

      routeUser(user)

      return user
    } catch (error) {
      console.log("Error while connecting user: ", error)
      return null
    }
  }

  async function getUserByAddress(
    address: Address
  ): Promise<Visitor | Student | Mentor> {
    try {
      const response = await fetch(`${BASE_USER_PATH}?address=${address}`)
      const { user } = await response.json()

      switch (user.role) {
        case Role.VISITOR:
          return user as Visitor
        case Role.STUDENT:
          return user as Student
        case Role.MENTOR:
          return user as Mentor
        default:
          return user as Visitor
      }
    } catch (error: any) {
      console.log("Error getting user: ", error)
      return { account: address, role: Role.VISITOR }
    }
  }

  function routeUser(user: Visitor | Student | Mentor): void {
    const url = new URL(window.location.href)
    const pathname = url.pathname
    const role = url.searchParams.get("role")

    switch (pathname) {
      case "/auth/signup":
      case "/auth/login":
        router.push(
          user.role !== Role.VISITOR
            ? `/dashboard/${user.role?.toLowerCase()}`
            : `/auth/signup/${role || "choice"}`
        )
        break
    }
  }

  async function logOut(): Promise<void> {
    router.push("/")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to log out")
      }

      disconnectAsync().then(() => {
        queryClient.resetQueries({
          queryKey: [QueryKeys.USER],
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const context: UserContextProps = {
    user,
    isConnected,
    loadingUser,
    logOut,
  }

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
