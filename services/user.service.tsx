"use client"
import { createContext, ReactNode, useContext } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Mentor, Student, User } from "@/lib/types/user.type"
import { IProvider } from "@web3auth/base"
import { Address, createWalletClient, custom } from "viem"
import { baseSepolia } from "viem/chains"
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"
import { Role } from "@/lib/types/role.type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: Student | Mentor | null | undefined
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
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data: user, isLoading: loadingUser } = useQuery<
    Student | Mentor | null,
    Error
  >({
    queryKey: [QueryKeys.USER, address?.toLowerCase() ?? "0x"],
    queryFn: () => fetchUser(),
  })

  async function fetchUser(): Promise<Student | Mentor | null> {
    if (!isConnected) return null

    try {
      let registeredUser: User | null = null
      let web3AuthData: Partial<OpenloginUserInfo> | null = null
      let userAddress: Address | null = null

      switch (connector?.name) {
        case Connectors.WEB3AUTH:
          if (!web3AuthInstance.connected) return null

          userAddress = await getUserAddress()

          if (!userAddress) return null

          registeredUser = await getRegisteredUser(userAddress)
          web3AuthData = await web3AuthInstance.getUserInfo()
          break

        default:
          if (!address) return null

          userAddress = address
          registeredUser = await getRegisteredUser(address)

          break
      }

      routeUser(registeredUser)

      return registeredUser
        ? registeredUser
        : {
            address: userAddress,
            web3AuthData,
          }
    } catch (error) {
      console.log("Error while connecting user: ", error)
      return null
    }
  }

  async function getUserAddress(): Promise<`0x${string}` | null> {
    if (!web3AuthInstance?.provider) {
      return null
    }

    const accounts: any[] = await getAccounts(web3AuthInstance.provider)
    return accounts && accounts.length ? accounts[0] : null
  }

  async function getRegisteredUser(
    address: string
  ): Promise<Student | Mentor | null> {
    try {
      const response = await fetch(`/api/user?address=${address}`)
      const { registeredUser } = await response.json()

      if (registeredUser.role === Role.MENTOR) {
        return registeredUser as Mentor
      }

      return registeredUser as Student
    } catch (error: any) {
      return null
    }
  }

  async function getAccounts(provider: IProvider): Promise<any> {
    try {
      const walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(provider),
      })

      const address = await walletClient.getAddresses()

      return address
    } catch (error) {
      return error
    }
  }

  async function logOut(): Promise<void> {
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

      router.push("/")

      disconnectAsync().then(() => {
        queryClient.resetQueries({
          queryKey: [QueryKeys.USER, address?.toLowerCase()],
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  function routeUser(registeredUser: Student | Mentor | null): void {
    const url = new URL(window.location.href)
    const pathname = url.pathname
    const role = url.searchParams.get("role")

    switch (pathname) {
      case "/auth/signup":
      case "/auth/login":
        router.push(
          registeredUser
            ? `/dashboard/${registeredUser.role?.toLowerCase()}`
            : `/auth/signup/${role || "choice"}`
        )
        break
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
