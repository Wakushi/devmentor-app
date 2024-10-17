"use client"

import { useMemo, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import clsx from "clsx"
import { SessionStatus } from "./pages/sessions/columns/status-column"
import { Session } from "@/lib/types/session.type"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Role } from "@/lib/types/role.type"

interface SessionDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  viewer: Role
}

export default function SessionsTable<TData, TValue>({
  columns,
  data,
  viewer,
}: SessionDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showPast, setShowPast] = useState<boolean>(false)

  const filteredSessions = useMemo(() => {
    return data.filter((session) => {
      const isPastSession = (session as Session).endTime < Date.now()
      return showPast ? true : !isPastSession
    })
  }, [data, showPast])

  const table = useReactTable({
    data: filteredSessions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function isMentorView(): boolean {
    return viewer === Role.MENTOR
  }

  const peer = isMentorView() ? "student" : "mentor"

  return (
    <div className="space-y-4 z-[2]">
      <div className="flex space-x-2">
        <Input
          placeholder="Filter topics..."
          value={(table.getColumn("topic")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("topic")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />
        <Input
          placeholder={`Filter ${peer}s...`}
          value={(table.getColumn(peer)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(peer)?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filter status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(SessionStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox
            id="showPast"
            checked={showPast}
            onCheckedChange={(checked) => setShowPast(checked as boolean)}
          />
          <Label className="cursor-pointer" htmlFor="showPast">
            Show past sessions
          </Label>
        </div>
      </div>
      <div className="glass rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={clsx({
                    "bg-background-shade": i % 2 === 1,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
