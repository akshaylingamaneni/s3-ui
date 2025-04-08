"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ViewOptions } from "./ViewOptions"
import { Search } from "lucide-react"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: isLoading ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <div className="w-full flex flex-col bg-white/50 dark:bg-zinc-800/40 rounded-lg px-4 py-4 border border-zinc-200 dark:border-zinc-800">
      <div className="rounded-md relative">
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
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`loading-${index}`} className="animate-pulse">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-4 bg-zinc-200 dark:bg-neutral-700/50 rounded w-[80%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors h-12"
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
                  className="h-24 text-center text-gray-500 dark:text-zinc-400"
                >
                  No files found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* todo: decide if we want to show a loading state or the existing loading state is good enough */}
        {/* {isLoading && (
          <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm rounded-md flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-zinc-400">Loading files...</span>
            </div>
          </div>
        )} */}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 bg-zinc-50 dark:bg-neutral-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
        {/* Search - Full width on mobile, fixed width on desktop */}
        <div className="w-full sm:w-[300px]">
          <div className="relative w-full bg-white dark:bg-neutral-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-400" />
            <Input
              placeholder="Search files..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8 h-8 w-full bg-transparent text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Controls - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* View Options and Rows per page */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ViewOptions table={table} />
            <p className="text-sm text-gray-600 dark:text-zinc-400">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[80px] border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 dark:border-zinc-800"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 dark:border-zinc-800"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-zinc-400">
                <span>Page</span>
                <strong className="text-gray-900 dark:text-zinc-100">
                  {table.getState().pagination.pageIndex + 1}
                </strong>
                <span>of</span>
                <strong className="text-gray-900 dark:text-zinc-100">
                  {table.getPageCount()}
                </strong>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 dark:border-zinc-800"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 dark:border-zinc-800"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-600 dark:text-zinc-400">
              {table.getFilteredRowModel().rows.length} total items
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 