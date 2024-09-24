import { LanguageOption } from "@/lib/types/profile-form.type"

export default function Flag({ lang }: { lang: LanguageOption }) {
  return (
    <img
      src={`https://flagsapi.com/${lang.code}/flat/64.png`}
      alt={`${lang.label} flag`}
      className="w-12 h-12 object-cover rounded"
    />
  )
}
