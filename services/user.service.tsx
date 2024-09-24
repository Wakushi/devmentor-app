"use client"
import { createContext, ReactNode, useContext } from "react"
import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { web3AuthInstance } from "@/lib/Web3AuthConnectorInstance"
import { usePathname, useRouter } from "next/navigation"
import { User } from "@/lib/types/user.type"
import { IProvider } from "@web3auth/base"
import { createWalletClient, custom } from "viem"
import { baseSepolia } from "viem/chains"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: User | null
  setUser: (user: User | ((prevUser: User | null) => User | null)) => void
  isConnected: boolean
  disconnectWallet: () => void
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isConnected: false,
  disconnectWallet: () => {},
})

export default function UserContextProvider(props: UserContextProviderProps) {
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      let registeredUser = null

      try {
        if (isConnected && connector?.name !== "Web3Auth" && address) {
          registeredUser = await getRegisteredUser(address)
          setUser(registeredUser ? registeredUser : { address })
          return
        }

        if (isConnected && web3AuthInstance) {
          const userInfo = await web3AuthInstance.getUserInfo()
          const web3AuthAddress = await getUserAddress()

          if (!web3AuthAddress) return

          registeredUser = await getRegisteredUser(web3AuthAddress)

          setUser(
            registeredUser
              ? registeredUser
              : {
                  address: web3AuthAddress,
                  web3AuthData: userInfo,
                }
          )
        }
      } catch (err) {
        console.log(err)
        localStorage.clear()
      } finally {
        routeUser(registeredUser)
      }

      if (!isConnected) {
        setUser(null)
        return
      }
    }

    fetchUserData()
  }, [isConnected])

  function routeUser(registeredUser: User | null): void {
    if (!isConnected) return

    if (
      (!registeredUser || !registeredUser?.registered) &&
      pathname === "/auth/signup"
    ) {
      router.push("/auth/signup/profile")
    }

    if (registeredUser?.registered) {
      router.push("/dashboard")
    }
  }

  function disconnectWallet(): void {
    disconnect()
    setUser(null)
    router.push("/")
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

  const context: UserContextProps = {
    user,
    setUser,
    isConnected,
    disconnectWallet,
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
