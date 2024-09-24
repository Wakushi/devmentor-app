"use client"
import { createContext, ReactNode, useContext } from "react"
import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { usePathname, useRouter } from "next/navigation"
import { User } from "@/lib/types/user.type"
import { IProvider } from "@web3auth/base"
import { Address, createWalletClient, custom } from "viem"
import { baseSepolia } from "viem/chains"
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: User | null
  setUser: (user: User | ((prevUser: User | null) => User | null)) => void
  isConnected: boolean
  loadingUser: boolean
  logOut: () => void
}

enum Connectors {
  METAMASK = "MetaMask",
  WEB3AUTH = "Web3Auth",
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isConnected: false,
  loadingUser: true,
  logOut: () => {},
})

export default function UserContextProvider(props: UserContextProviderProps) {
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState<boolean>(true)

  useEffect(() => {
    handleUserConnect()
  }, [address, web3AuthInstance.connected])

  async function handleUserConnect(): Promise<void> {
    if (!isConnected) {
      setLoadingUser(false)
      return
    }

    setLoadingUser(true)

    try {
      let registeredUser: User | null = null
      let userInfo: Partial<OpenloginUserInfo> | null = null
      let userAddress: Address | null = null

      switch (connector?.name) {
        case Connectors.WEB3AUTH:
          if (!web3AuthInstance.connected) return

          userInfo = await web3AuthInstance.getUserInfo()
          userAddress = await getUserAddress()

          if (!userAddress) return

          registeredUser = await getRegisteredUser(userAddress)

          break

        default:
          if (!address) return

          userAddress = address
          registeredUser = await getRegisteredUser(address)

          break
      }

      if (registeredUser) {
        setUser(registeredUser)
      } else {
        const newUser = {
          address: userAddress,
          userInfo,
        }

        setUser(newUser)
      }

      routeUser(registeredUser)
    } catch (error) {
      console.log("Error while connecting user: ", error)
    } finally {
      setLoadingUser(false)
    }
  }

  function routeUser(registeredUser: User | null): void {
    switch (pathname) {
      case "/auth/signup":
      case "/auth/login":
        router.push(
          registeredUser ? "/dashboard/student" : "/auth/signup/profile"
        )
        break
    }
  }

  async function getUserAddress(): Promise<`0x${string}` | null> {
    if (!web3AuthInstance?.provider) {
      return null
    }

    const accounts: any[] = await getAccounts(web3AuthInstance.provider)
    return accounts && accounts.length ? accounts[0] : null
  }

  async function getRegisteredUser(address: string): Promise<User | null> {
    const response = await fetch(`/api/user?address=${address}`)
    const { registeredUser } = await response.json()
    return registeredUser
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

      disconnect()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  const context: UserContextProps = {
    user,
    setUser,
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
