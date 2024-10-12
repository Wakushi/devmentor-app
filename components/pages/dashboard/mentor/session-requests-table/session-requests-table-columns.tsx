"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
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
import { AlertDialog } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Student } from "@/lib/types/user.type"
import { PiStudent } from "react-icons/pi"
import { GoGoal } from "react-icons/go"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"
import { CiDollar } from "react-icons/ci"

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
          <GoGoal className="w-5 h-5" />
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
