"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import CopyWrapper from "./ui/copy-wrapper"
import ContactIcon from "./contact-icon"
import Copy from "./ui/copy"
import { Button } from "./ui/button"
import { FaEye } from "react-icons/fa"
import { ContactType } from "@/lib/types/profile-form.type"
import { useUser } from "@/stores/user.store"
import { useSignMessage } from "wagmi"
import { decryptWithSignature } from "@/lib/crypto/crypto"

export default function StudentContactDialog({
  contactHash,
  children,
}: {
  contactHash: string
  children: ReactNode
}) {
  const { user } = useUser()
  const { signMessageAsync } = useSignMessage()

  const [contact, setContact] =
    useState<{ type: ContactType; value: string }[]>()

  async function decryptContactInfo(): Promise<void> {
    if (!user) return

    const message = "Sign to decrypt your student contact information."

    const signature = await signMessageAsync({
      message,
    })

    const rawContact = await decryptWithSignature({
      encryptedData: contactHash,
      address: user?.account,
      signature,
      message,
    })

    const contact = JSON.parse(rawContact)
    setContact(contact)
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        {!!contact ? (
          <>
            <DialogHeader>
              <DialogTitle>Decrypt student contact</DialogTitle>
              <DialogDescription>
                Here are your student contact information
              </DialogDescription>
            </DialogHeader>
            {contact.map(({ value, type }) => (
              <CopyWrapper key={value + type} contentToCopy={value}>
                <div className="flex text-base items-center max-h-none border-none justify-between w-full h-auto max-w-none p-4 rounded-md shadow-lg hover:shadow-xl hover:bg-white hover:bg-opacity-[0.03] glass hover:opacity-80 cursor-pointer">
                  <div className="flex gap-1 items-center">
                    <ContactIcon type={type} />
                    <span>{value}</span>
                  </div>
                  <Copy contentToCopy={value} />
                </div>
              </CopyWrapper>
            ))}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Decrypt student contact</DialogTitle>
              <DialogDescription>
                Please sign to decrypt your student contact informations
              </DialogDescription>
            </DialogHeader>
            <Button onClick={decryptContactInfo}>
              <FaEye /> See contact
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
