"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"
import { ViewOptions } from "./ViewOptions"

interface DataTableFooterProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function DataTableFooter<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DataTableFooterProps<TData>) {
  return (
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
  )
}