"use client"
import { toast } from "@/hooks/use-toast"
import { ReactNode } from "react"

interface CopyProps {
  children: ReactNode
  contentToCopy: string
}

export default function CopyWrapper({ children, contentToCopy }: CopyProps) {
  function copyToClipboard(e: any) {
    e.stopPropagation()
    navigator.clipboard.writeText(contentToCopy)
    toast({
      title: "Copied to clipboard",
    })
  }

  return <div onClick={(e) => copyToClipboard(e)}>{children}</div>
}
