"use client"

import { DateSegment } from "./date-segment"
import { useRef } from "react"
import {
  AriaTimeFieldProps,
  TimeValue,
  useLocale,
  useTimeField,
} from "react-aria"
import { useTimeFieldState } from "react-stately"
import { cn } from "@/lib/utils"

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const { locale } = useLocale()
  const state = useTimeFieldState({
    ...props,
    locale,
  })
  const {
    fieldProps: { ...fieldProps },
    labelProps,
  } = useTimeField(props, state, ref)

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex w-full flex-1 rounded-md bg-transparent text-sm ring-offset-background",
        props.isDisabled ? "cursor-not-allowed opacity-50" : ""
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  )
}

export { TimeField }
