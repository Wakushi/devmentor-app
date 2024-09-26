import { LanguageOption } from "@/lib/types/profile-form.type"
import clsx from "clsx"
import TooltipWrapper from "./custom-tooltip"

export default function Flag({
  lang,
  size = "default",
}: {
  lang: LanguageOption
  size?: "default" | "small"
}) {
  return (
    <TooltipWrapper message={lang.label}>
      <img
        src={`https://flagsapi.com/${lang.code}/flat/64.png`}
        alt={`${lang.label} flag`}
        className={clsx(
          "object-cover rounded drop-shadow-lg fade-in-bottom opacity-0",
          {
            "w-12 h-12": size === "default",
            "w-8 h-8": size === "small",
          }
        )}
      />
    </TooltipWrapper>
  )
}
