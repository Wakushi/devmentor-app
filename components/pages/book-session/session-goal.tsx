import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function SessionGoalInput({
  sessionGoals,
  setSessionGoals,
}: {
  sessionGoals: string
  setSessionGoals: (goal: string) => void
}) {
  return (
    <Card className="flex-1 glass border-stone-800 text-white max-w-fit fade-in-bottom">
      <CardHeader>
        <h3 className="text-2xl">Session Objectives</h3>
        <p className="text-dim text-base">
          Describe your specific learning goals for this session below. This
          information is crucial for your mentor to structure an effective and
          personalized session for you.
        </p>
      </CardHeader>
      <CardContent>
        <Textarea
          value={sessionGoals}
          rows={3}
          className="resize-none"
          onChange={(e: any) => {
            setSessionGoals(e.target.value)
          }}
          placeholder={`- Debug my smart contract deployment issues on Ethereum 
- Write a smart contract that implements a multi-signature wallet
- Understand and implement ERC-721 for NFT creation`}
        />
        <p className="py-2 text-extra-small text-dim text-end">
          {sessionGoals.length < 10 ? (
            <span>Minimum 10 characters</span>
          ) : (
            <span>{sessionGoals.length}/1000</span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
