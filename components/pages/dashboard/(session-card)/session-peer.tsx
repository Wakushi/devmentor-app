import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export default function SessionPeer({ name = "Anon" }: { name?: string }) {
  return (
    <div className="flex flex-1 flex-col justify-center items-center gap-1">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}`}
          alt={name}
        />
        <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
      </Avatar>
      <span className="text-small text-center">{name}</span>
    </div>
  )
}
