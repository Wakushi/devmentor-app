"use client"

import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { formatDate, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CalendarDays, Clock, MoreHorizontal } from "lucide-react"
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
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Student } from "@/lib/types/user.type"
import { PiStudent } from "react-icons/pi"
import { GoGoal } from "react-icons/go"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import {
  acceptSession,
  ContractEvent,
  watchForEvent,
  weiToUsd,
} from "@/services/contract.service"
import { CiDollar } from "react-icons/ci"
import { FaEye, FaLongArrowAltRight } from "react-icons/fa"
import { RiContactsBook3Fill } from "react-icons/ri"
import { useSignMessage } from "wagmi"
import { decryptWithSignature } from "@/lib/crypto/crypto"
import { useUser } from "@/stores/user.store"
import Copy from "@/components/ui/copy"
import { ContactType } from "@/lib/types/profile-form.type"
import CopyWrapper from "@/components/ui/copy-wrapper"
import { getFileByHash } from "@/services/ipfs.service"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { QueryKeys } from "@/lib/types/query-keys.type"
import Link from "next/link"
import ContactIcon from "@/components/contact-icon"
import StudentContactDialog from "@/components/student-contact-dialog"
import StudentGoalsDialog from "@/components/student-goals-dialog"

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
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      const topic: string = row.getValue("topic")
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
    accessorKey: "studentContactHash",
    header: "Contact",
    cell: ({ row }) => {
      const contactHash: string = row.getValue("studentContactHash")

      return (
        <StudentContactDialog contactHash={contactHash}>
          <RiContactsBook3Fill className="w-6 h-6 text-primary hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100" />
        </StudentContactDialog>
      )
    },
  },
  {
    accessorKey: "sessionGoalHash",
    header: "Objectives",
    cell: ({ row }) => {
      const sessionGoalHash: string = row.getValue("sessionGoalHash")

      return (
        <StudentGoalsDialog sessionGoalHash={sessionGoalHash}>
          <GoGoal className="w-6 h-6 text-dm-accent hover:-translate-y-1 transition-all duration-200 opacity-70 hover:opacity-100 cursor-pointer" />
        </StudentGoalsDialog>
      )
    },
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
      const { user } = useUser()
      const queryClient = useQueryClient()

      async function handleAcceptSession(): Promise<void> {
        const sessionId = row.original.id

        if (!user || sessionId === undefined) return

        try {
          toast({
            title: "Pending confirmation...",
            action: <Loader fill="white" color="primary" size="4" />,
          })

          await acceptSession({
            account: user.account,
            accepted: true,
            sessionId,
          })

          toast({
            title: "Accepting session...",
            action: <Loader fill="white" color="primary" size="4" />,
          })

          watchForEvent({
            event: ContractEvent.SESSION_VALIDATED,
            args: { mentorAccount: user.account },
            handler: () => {
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.SESSIONS, user?.account],
              })

              toast({
                title: "Success",
                description: "Session accepted !",
                action: (
                  <Link
                    href="/mentor/dashboard"
                    className="bg-transparent flex items-center gap-1 border border-white text-white rounded text-xs w-fit font-semibold px-2 py-1"
                  >
                    See on dashboard <FaLongArrowAltRight />
                  </Link>
                ),
              })
            },
          })
        } catch (error: any) {
          console.log("error: ", error)
          toast({
            title: "Error",
            variant: "destructive",
            description: "Something wrong happened !",
          })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-dim text-white">
            <DropdownMenuItem
              className="flex drop-shadow-lg justify-center cursor-pointer"
              onClick={handleAcceptSession}
            >
              Accept session
            </DropdownMenuItem>
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
