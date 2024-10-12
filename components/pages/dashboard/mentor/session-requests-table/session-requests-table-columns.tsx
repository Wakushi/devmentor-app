"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ArrowUpDown,
  CalendarDays,
  Clock,
  MoreHorizontal,
  User2Icon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { Student } from "@/lib/types/user.type"
import { PiStudent } from "react-icons/pi"
import { GoGoal } from "react-icons/go"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"
import { CiDollar } from "react-icons/ci"
import {
  FaDiscord,
  FaEye,
  FaGithub,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa"
import { RiContactsBook3Fill } from "react-icons/ri"
import { useSignMessage } from "wagmi"
import { decryptWithSignature } from "@/lib/crypto/crypto"
import { Address } from "viem"
import { useUser } from "@/stores/user.store"
import Copy from "@/components/ui/copy"
import { ContactType } from "@/lib/types/profile-form.type"
import { MdAlternateEmail } from "react-icons/md"
import CopyWrapper from "@/components/ui/copy-wrapper"
import { getFileByHash } from "@/services/ipfs.service"

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return <SortableColumnHead column={column} title="Date" />
    },
    cell: ({ row }) => {
      const startTime: number = row.getValue("startTime")
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <CalendarDays className="w-5 h-5" />
          <span className="text-dim">{formatDate(startTime)}</span>
        </div>
      )
    },
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const { startTime, endTime } = row.original
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <Clock className="w-5 h-5" />
          <span>{formatTime(startTime)}</span>-
          <span>{formatTime(endTime)}</span>
        </div>
      )
    },
  },
  {
    id: "meetingEvent",
    header: "Topic",
    cell: ({ row }) => {
      const topic = "Blockchain 101"
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <span>{topic}</span>
        </div>
      )
    },
  },
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => {
      const student: Student | undefined = row.original.student
      const studentName = student ? student.baseUser.userName : "Anon"
      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <PiStudent className="w-5 h-5" />
          <span>{studentName}</span>
        </div>
      )
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { user } = useUser()
      const { signMessageAsync } = useSignMessage()

      const [contact, setContact] =
        useState<{ type: ContactType; value: string }[]>()

      function ContactIcon({ type }: { type: ContactType }) {
        switch (type) {
          case ContactType.DISCORD:
            return <FaDiscord />
          case ContactType.EMAIL:
            return <MdAlternateEmail />
          case ContactType.TWITTER:
            return <FaTwitter />
          case ContactType.LINKEDIN:
            return <FaLinkedin />
          case ContactType.GITHUB:
            return <FaGithub />
          case ContactType.TELEGRAM:
            return <FaTelegram />
          default:
            return <User2Icon />
        }
      }

      async function decryptContactInfo(): Promise<void> {
        if (!user) return

        const contactHash: string = row.original.studentContactHash
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
          <DialogTrigger>
            <RiContactsBook3Fill className="w-6 h-6 text-primary hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100" />
          </DialogTrigger>
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
    },
  },
  {
    accessorKey: "sessionGoalHash",
    header: "Objectives",
    cell: ({ row }) => <ObjectivesCell row={row} />,
  },
  {
    accessorKey: "valueLocked",
    header: ({ column }) => {
      return <SortableColumnHead column={column} title="Value locked" />
    },
    cell: ({ row }) => {
      const valueLocked: number = row.getValue("valueLocked")

      const ethPriceQuery = useEthPriceQuery()
      const { data: ethPrice } = ethPriceQuery

      const sessionPriceUsd = weiToUsd(valueLocked, ethPrice ?? 0)

      return (
        <div className="flex items-center gap-2 text-small text-dim">
          <CiDollar className="w-5 h-5" />
          <span>${sessionPriceUsd}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState<boolean>(false)

      async function updateStatus() {}

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DropdownMenuItem
                className="cursor-pointer p-2"
                onClick={() => updateStatus()}
              >
                Action
              </DropdownMenuItem>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function SortableColumnHead({
  column,
  title,
}: {
  column: Column<Session, unknown>
  title: string
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

const ObjectivesCell = ({ row }: { row: Row<Session> }) => {
  const [objectives, setObjectives] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sessionGoalHash: string = row.getValue("sessionGoalHash")

  useEffect(() => {
    if (dialogOpen && !objectives && !isLoading) {
      setIsLoading(true)
      getFileByHash(sessionGoalHash)
        .then(({ sessionGoals }) => {
          setObjectives(sessionGoals)
        })
        .catch((error) => {
          console.error("Failed to fetch objectives:", error)
          setObjectives("Failed to load objectives.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [dialogOpen, objectives, sessionGoalHash])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <GoGoal
          onClick={() => setDialogOpen(true)}
          className="w-6 h-6 text-dm-accent hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student objectives</DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading..." : objectives}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
