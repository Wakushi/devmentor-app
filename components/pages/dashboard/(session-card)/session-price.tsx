import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"
import { CiDollar } from "react-icons/ci"

export default function SessionPrice({
  sessionPriceWei,
}: {
  sessionPriceWei: number
}) {
  const ethPriceQuery = useEthPriceQuery()
  const { data: ethPrice } = ethPriceQuery
  const sessionPriceUsd = weiToUsd(sessionPriceWei, ethPrice ?? 0)

  return (
    <div className="flex items-center gap-2">
      <CiDollar className="w-5 h-5" />
      <div className="flex items-center text-small text-dim gap-1">
        {sessionPriceUsd > 0 ? (
          <span>${sessionPriceUsd}</span>
        ) : (
          <span>Free</span>
        )}
        (session)
      </div>
    </div>
  )
}
