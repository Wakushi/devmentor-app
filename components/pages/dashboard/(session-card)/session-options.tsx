"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  acceptSession,
  confirmSession,
  ContractEvent,
  watchForEvent,
} from "@/services/contract.service"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/ui/loader"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { FaCircleCheck } from "react-icons/fa6"
import { useQueryClient } from "@tanstack/react-query"
import { IoIosMore } from "react-icons/io"
import { Session } from "@/lib/types/session.type"
import { Mentor, Student } from "@/lib/types/user.type"
import { Role } from "@/lib/types/role.type"
import { useState } from "react"
import RatingDialog from "@/components/rating-dialog"
import Link from "next/link"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function SessionOptions({
  user,
  session,
}: {
  session: Session
  user: Mentor | Student
}) {
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  function isPastSession(): boolean {
    return session.endTime < Date.now()
  }

  function isConfirmedByUser(): boolean {
    return user.role === Role.MENTOR
      ? session.mentorConfirmed
      : session.studentConfirmed
  }

  async function handleAcceptSession(): Promise<void> {
    if (!user || session.id === undefined) return

    try {
      toast({
        title: "Pending confirmation...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      await acceptSession({
        account: user.account,
        accepted: true,
        sessionId: session.id,
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

  async function onRevokeSession(): Promise<void> {
    if (!user || session.id === undefined) return

    try {
      toast({
        title: "Pending confirmation...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      await acceptSession({
        account: user.account,
        accepted: false,
        sessionId: session.id,
      })

      toast({
        title: "Revoking session...",
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
            description: "Session approval revoked successfully",
            action: <FaCircleCheck className="text-white" />,
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

  function onConfirmSession(): void {
    if (user.role === Role.STUDENT) {
      setDialogOpen(true)
      return
    }

    handleConfirmSession()
  }

  function onRateMentor(rating: number): void {
    setDialogOpen(false)
    handleConfirmSession(rating)
  }

  async function handleConfirmSession(rating?: number) {
    if (session.id === undefined) return

    try {
      toast({
        title: "Confirming session...",
        action: <Loader fill="white" color="primary" size="4" />,
      })

      await confirmSession({
        user,
        sessionId: session.id,
        rating,
      })

      watchForEvent({
        event: ContractEvent.SESSION_CONFIRMED,
        args: { confirmedBy: user.account },
        handler: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.SESSIONS, user.account],
          })

          toast({
            title: "Success",
            description: "Session confirmed successfully !",
            action: <FaCircleCheck className="text-white" />,
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

  function DynamicActions() {
    const actions: any = []

    if (!isPastSession() && user.role === Role.MENTOR) {
      if (session.accepted) {
        actions.push(
          <DropdownMenuItem
            key="revoke"
            className="flex drop-shadow-lg justify-center cursor-pointer"
            onClick={onRevokeSession}
          >
            Revoke session
          </DropdownMenuItem>
        )

        return actions
      }

      actions.push(
        <DropdownMenuItem
          key="revoke"
          className="flex drop-shadow-lg justify-center cursor-pointer"
          onClick={handleAcceptSession}
        >
          Accept session
        </DropdownMenuItem>
      )

      return actions
    }

    if (isPastSession() && !isConfirmedByUser()) {
      actions.push(
        <DropdownMenuItem
          key="confirm"
          className="flex drop-shadow-lg justify-center cursor-pointer"
          onClick={onConfirmSession}
        >
          Confirm session
        </DropdownMenuItem>
      )
    }

    if (!actions.length) {
      actions.push(
        <DropdownMenuItem
          key="no_actions"
          className="flex drop-shadow-lg justify-center cursor-pointer"
        >
          No actions
        </DropdownMenuItem>
      )
    }

    return actions
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IoIosMore />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass border-dim text-white">
          <DynamicActions />
        </DropdownMenuContent>
      </DropdownMenu>
      <RatingDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onRateMentor={onRateMentor}
      />
    </>
  )
}
