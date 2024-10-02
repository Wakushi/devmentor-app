import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { getEthPrice } from "@/lib/actions/web3/contract"

export default function useEthPriceQuery() {
  const ethPriceQuery = useQuery<number, Error>({
    queryKey: [QueryKeys.ETH_PRICE],
    queryFn: () => getEthPrice(),
  })

  return ethPriceQuery
}
