"use client"

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableOptions,
} from "@tanstack/react-table"
import { SetStateAction, useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils"

//
// New Props interface: we remove pageIndex and pageCount,
// and instead use nextToken and prevToken along with an onTokenChange callback.
//
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  nextToken: string | null
  prevToken: boolean | null
  pageSize: number
  onTokenChange: (direction: "next" | "prev") => void
  totalRows: number
  isLoading?: boolean
  setSelected?: SetStateAction<any>
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nextToken,
  prevToken,
  pageSize,
  onTokenChange,
  totalRows,
  isLoading = false,
  setSelected,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  //
  // Because data is loaded server-side based on tokens,
  // we “fix” the pagination state to always be the first page.
  //
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
      columnFilters,
      sorting,
      rowSelection,
    },
    // Required callbacks:
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    manualSorting: true,
    manualFiltering: true,
  } as TableOptions<TData>)

  useEffect(() => {
    if (table.getFilteredSelectedRowModel().rows.length > 0 && setSelected) {
      setSelected(table.getFilteredSelectedRowModel().rows[0].original)
    } else if (setSelected) {
      setSelected(null)
    }
  }, [rowSelection, setSelected, table])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-sm text-gray-700">
          Showing {data.length} of {totalRows} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTokenChange("prev")}
            disabled={prevToken || isLoading}
          >
            הקודם
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTokenChange("next")}
            disabled={!nextToken || isLoading}
          >
            המשך
          </Button>
        </div>
      </div>
    </div>
  )
}
