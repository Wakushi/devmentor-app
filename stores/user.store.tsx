"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"
import { useRouter } from "next/navigation"
import { Mentor, Student, Visitor } from "@/lib/types/user.type"
import { Role } from "@/lib/types/role.type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { web3AuthInstance } from "@/lib/web3/Web3AuthConnectorInstance"
import { toast } from "@/hooks/use-toast"

interface UserContextProviderProps {
  children: ReactNode
}

interface UserContextProps {
  user: Visitor | Student | Mentor | null | undefined
  loadingUser: boolean
  isConnected: boolean
  logOut: () => void
  pendingAuth: boolean
  setPendingAuth: (pendingAuth: boolean) => void
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loadingUser: false,
  isConnected: false,
  logOut: () => {},
  pendingAuth: false,
  setPendingAuth: (pendingAuth: boolean) => {},
})

export default function UserContextProvider(props: UserContextProviderProps) {
  const { address, isConnected } = useAccount()
  const { disconnect, disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const [pendingAuth, setPendingAuth] = useState<boolean>(false)

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
    if (!isConnected && !web3AuthInstance.connected) {
      queryClient.resetQueries({
        queryKey: [QueryKeys.USER],
      })
      return
    }

    queryClient.refetchQueries({ queryKey: [QueryKeys.USER] })
  }, [web3AuthInstance.connected, isConnected])

  async function fetchUser(): Promise<Visitor | Student | Mentor | null> {
    if (!isConnected && !web3AuthInstance.connected) {
      await clearToken()
      return null
    }

    try {
      const user: Visitor | Student | Mentor | null = await loginWithToken()

      return user || (await login())
    } catch (error) {
      console.log("Error while connecting user: ", error)
      return null
    }
  }

  async function login(): Promise<Visitor | Mentor | Student | null> {
    setPendingAuth(true)

    try {
      const nonce = Math.random().toString(36).substring(2, 15)

      toast({
        title: "Pending signature",
        description: "Waiting for authentification signature...",
      })

      const signature = await signMessageAsync({ message: nonce })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, nonce }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const { data: user } = await response.json()

      if (user) {
        routeUser(user)
      }

      return user
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: "Failed to authenticate, please try again.",
      })

      disconnect()
      return null
    } finally {
      setPendingAuth(false)
    }
  }

  async function loginWithToken(): Promise<Visitor | Mentor | Student | null> {
    const response = await fetch("/api/auth/login-with-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    const { data: user } = await response.json()

    return user
  }

  async function logOut(): Promise<void> {
    router.push("/")

    try {
      await clearToken()

      disconnectAsync().then(() => {
        queryClient.resetQueries({
          queryKey: [QueryKeys.USER],
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function clearToken(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to log out")
    }
  }

  function routeUser(user: Visitor | Student | Mentor): void {
    const url = new URL(window.location.href)
    const pathname = url.pathname
    const role = url.searchParams.get("role")

    if (["/auth/signup", "/auth/login"].includes(pathname)) {
      router.push(
        user.role !== Role.VISITOR
          ? `/${user.role?.toLowerCase()}/dashboard`
          : `/auth/signup/${role || "choice"}`
      )
    }
  }

  const context: UserContextProps = {
    user,
    isConnected,
    loadingUser,
    logOut,
    pendingAuth,
    setPendingAuth,
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
