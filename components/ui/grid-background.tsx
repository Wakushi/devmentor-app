import { cn } from "@/lib/utils"
import GridPattern from "../magicui/grid-pattern"

export default function GridBackground() {
  return (
    <GridPattern
      width={100}
      height={100}
      x={-1}
      y={-1}
      className={cn(
        "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-40"
      )}
    />
  )
}
