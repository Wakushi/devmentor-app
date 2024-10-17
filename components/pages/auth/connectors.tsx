"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Connector, useConnect } from "wagmi"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { connect } from "@wagmi/core"
import { config } from "@/providers"
import { FaGoogle } from "react-icons/fa"
import Loader from "@/components/ui/loader"
import { usePathname } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@/stores/user.store"
import { useEffect, useState } from "react"

export default function Connectors() {
  const { connectors } = useConnect()
  const { pendingAuth, setPendingAuth } = useUser()
  const pathName = usePathname()

  async function handleConnect(connector: Connector) {
    try {
      await connect(config, { connector })
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something wrong happened !",
      })

      setPendingAuth(false)
    }
  }

  return (
    <>
      <div className="flex flex-col fade-in-bottom items-center justify-center gap-4 w-full max-w-[250px] min-h-[90px] my-2">
        {connectors.map((connector) => {
          const { id, icon, name } = connector
          return (
            <Button
              className="w-full gap-2"
              key={id}
              onClick={() => {
                handleConnect(connector)
              }}
            >
              {connector.id === "web3auth" && (
                <FaGoogle className="text-lg drop-shadow-lg" />
              )}
              {icon && <ConnectorIcon url={icon} name={name} />}
              {pathName === "/auth/login" ? "Connect" : "Signup"} with {name}
            </Button>
          )
        })}
      </div>
      <PendingSignatureDialog pendingAuth={pendingAuth} />
    </>
  )
}

function ConnectorIcon({ url, name }: { url: string; name: string }) {
  return (
    <div className="w-[20px] h-[20px]">
      <Image width="100" height="100" src={url} alt={name}></Image>
    </div>
  )
}

function PendingSignatureDialog({ pendingAuth }: { pendingAuth: boolean }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  useEffect(() => {
    setOpenDialog(pendingAuth)
  }, [pendingAuth])

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center gap-4 p-4">
          <div className="flex flex-col items-center gap-2">
            <AlertDialogTitle className="text-center">
              Secure Sign-In Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              To ensure your security, we need you to sign a message with your
              wallet. This quick step lets you access Devmentor without any
              associated costs or transactions.
            </AlertDialogDescription>
          </div>
          <Loader />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
