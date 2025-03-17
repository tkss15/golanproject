"use client"

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  sortingFns,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SetStateAction, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
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
  compareItems,
} from '@tanstack/match-sorter-utils'
import React from "react"
interface DataTableProps<TData, TValue> {
  label: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//   let dir = 0

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank!,
//       rowB.columnFiltersMeta[columnId]?.itemRank!
//     )
//   }

//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
// }
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
export function DataTable<TData, TValue>({
  label,
  columns,
  data,
  setSelected,
  setGlobalSerc,
  GlobalSerc
}: DataTableProps<TData, TValue> & { setSelected?: SetStateAction<any>, setGlobalSerc?: SetStateAction<any>, GlobalSerc: string }) {
  // const [globalFilter, setGlobalFilter] = React.useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    enableMultiRowSelection: false,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter:GlobalSerc,
    },
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 8, //custom default page size
      },
    },
  })
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  useEffect(() => {
    if(table.getFilteredSelectedRowModel().rows.length > 0)
      setSelected(table.getFilteredSelectedRowModel().rows[0].original);
    else 
      setSelected(null);
  }, [rowSelection])
  return (
    <>
      <div className="my-5">
        {/* <DebouncedInput
          value={GlobalSerc ?? ''}
          onChange={value => setGlobalSerc(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder={"חפש " + label}
        /> */}
      </div>
    <div className="mobile-table block md:hidden">
          <article className="flex flex-col gap-3">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <div key={row.id} className="border border-block rounded-md p-3 grid gap-2 bg-card shadow-sm">
                  {row.getVisibleCells().map((cell) => (
                    cell.column.columnDef.meta?.hidden ? (null) : (
                      <div key={cell.id} className={`${cell.column.id === 'actions' ? 'flex justify-end -order-1' : 'flex flex-row gap-2 items-center'}`}>
                        {/* Show column header name in mobile */}
                        {/* {cell.column.id !== 'actions' && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {cell.column.columnDef.header ? (
                              typeof cell.column.columnDef.header === 'string' 
                                ? cell.column.columnDef.header 
                                : cell.column.id
                            ) : cell.column.id}
                          </span>
                        )} */}
                        <div className={`${cell.column.id === 'actions' ? '' : 'flex-1'}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ))
            ) : (
              <div className="border border-dashed rounded-md p-6 text-center">
                <p className="text-muted-foreground">אין תוצאות</p>
              </div>
            )}
          </article>
          
          <div className="flex flex-col space-y-3 py-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-muted-foreground">שורות בעמוד:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value))
                  }}
                  className="h-8 w-16 rounded-md border border-input bg-transparent text-sm">
                  {[8, 16, 24, 32].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm">
                <strong>{table.getState().pagination.pageIndex + 1}</strong> / <strong>{table.getPageCount()}</strong>
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                ראשון
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                הקודם
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                המשך
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                אחרון
              </Button>
            </div>
          </div>
    </div>
    <div className="rounded-md border hidden md:block">
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
            table.getRowModel().rows.map((row) => (
              <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                אין תוצאות
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm text-muted-foreground">שורות בעמוד:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="h-8 w-16 rounded-md border border-input bg-transparent text-sm">
            {[8, 16, 24, 32].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">עמוד ראשון</span>
            <span>«</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-2 text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            הקודם
          </Button>
          <span className="flex items-center gap-1 text-sm">
            עמוד <strong>{table.getState().pagination.pageIndex + 1}</strong> מתוך <strong>{table.getPageCount()}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-2 text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            המשך
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">עמוד אחרון</span>
            <span>»</span>
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}
