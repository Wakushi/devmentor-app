"use client"
import { toast } from "@/hooks/use-toast"
import TooltipWrapper from "./custom-tooltip"
import { IoCopyOutline } from "react-icons/io5"

interface CopyProps {
  contentToCopy: string
  tooltipPosition?: "top" | "bottom" | "left" | "right"
}

export default function Copy({ contentToCopy, tooltipPosition }: CopyProps) {
  function copyToClipboard(e: any) {
    e.stopPropagation()
    navigator.clipboard.writeText(contentToCopy)
    toast({
      title: "Copied to clipboard",
    })
  }

  return (
    <TooltipWrapper side={tooltipPosition} message="Copy">
      <IoCopyOutline onClick={(e) => copyToClipboard(e)} />
    </TooltipWrapper>
  )
}
