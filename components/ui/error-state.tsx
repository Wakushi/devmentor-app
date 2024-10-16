import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { MdError } from "react-icons/md"

export default function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <MdError className="text-9xl mb-4 text-error" />
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Oops! An error occurred</h3>
        <p className="text-muted-foreground">
          We're sorry, but we couldn't load the requested information.
        </p>
      </div>
      <Button onClick={onRetry} className="flex items-center">
        <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
      </Button>
    </div>
  )
}
