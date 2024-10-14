import HourlyRate from "@/components/hourly-rate"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"

export default function SessionPrice({
  sessionPriceWei,
}: {
  sessionPriceWei: number
}) {
  const ethPriceQuery = useEthPriceQuery()
  const { data: ethPrice } = ethPriceQuery
  const sessionPriceUsd = weiToUsd(sessionPriceWei, ethPrice ?? 0)

  return <HourlyRate hourlyRate={sessionPriceUsd} />
}
