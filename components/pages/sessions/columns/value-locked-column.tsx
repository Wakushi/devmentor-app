import { Session } from "@/lib/types/session.type"
import { ColumnDef } from "@tanstack/react-table"
import SortableColumnHead from "./sortable-column-head"
import useEthPriceQuery from "@/hooks/queries/eth-price-query"
import { weiToUsd } from "@/services/contract.service"
import { CiDollar } from "react-icons/ci"

export const valueLockedColumn: ColumnDef<Session> = {
  accessorKey: "valueLocked",
  header: ({ column }) => {
    return <SortableColumnHead column={column} title="Value locked" />
  },
  cell: ({ row }) => {
    const valueLocked: number = row.getValue("valueLocked")

    const ethPriceQuery = useEthPriceQuery()
    const { data: ethPrice } = ethPriceQuery

    const sessionPriceUsd = weiToUsd(valueLocked, ethPrice ?? 0)

    return (
      <div className="flex items-center gap-2 text-small text-dim">
        <CiDollar className="w-5 h-5" />
        <span>${sessionPriceUsd}</span>
      </div>
    )
  },
}
