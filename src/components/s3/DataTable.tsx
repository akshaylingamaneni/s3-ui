"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { 
  Download, 
  Trash, 
  FileEdit, 
  Move, 
  Link, 
  Copy,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DataTableFooter } from "@/components/s3/DataTableFooter"
import { columns } from '@/components/s3/columns'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  onActionClick?: (action: string, item: any) => void
}

export function DataTable<TData, TValue>({
  columns: columnDefs,
  data,
  isLoading = false,
  onRowClick,
  onActionClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: any;
    isOpen: boolean;
  }>({
    x: 0,
    y: 0,
    item: null,
    isOpen: false,
  });

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      isOpen: true,
    });
  };

  const handleFileAction = (action: string, item: any) => {
    console.log(`Action: ${action}`, item);
    if (onActionClick) {
      onActionClick(action, item);
    }
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const table = useReactTable({
    data: isLoading ? [] : data as any,
    columns: columns(handleFileAction),
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
                  {table.getAllColumns().map((column) => (
                    <TableCell 
                      key={column.id} 
                      className={column.id === "size" || column.id === "lastModified" ? 
                        "text-right hidden sm:table-cell" : 
                        column.id === "actions" ? "text-right" : ""}
                    >
                      <div className={`h-4 bg-zinc-200 dark:bg-neutral-700/50 rounded ${
                        column.id === "name" ? "w-[90%] ml-9" : 
                        column.id === "size" ? "w-[60%] ml-auto" : 
                        column.id === "lastModified" ? "w-[70%] ml-auto" : 
                        column.id === "actions" ? "w-[40%] ml-auto" : "w-[80%]"
                      }`} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors h-12"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onRowClick) onRowClick(row.original as any);
                  }}
                  onContextMenu={(e) => handleContextMenu(e, row.original)}
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
                  colSpan={columnDefs.length}
                  className="h-24 text-center text-gray-500 dark:text-zinc-400"
                >
                  No files found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Context Menu */}
        {contextMenu.isOpen && contextMenu.item && (
          <DropdownMenu open={contextMenu.isOpen} onOpenChange={(open) => setContextMenu(prev => ({ ...prev, isOpen: open }))}>
            <DropdownMenuTrigger asChild>
              <div className="fixed top-0 left-0 h-0 w-0" style={{ top: contextMenu.y, left: contextMenu.x }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {contextMenu.item.isDirectory ? (
                // Folder options
                <>
                  <DropdownMenuItem onClick={() => handleFileAction('rename', contextMenu.item)}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('download', contextMenu.item)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('copy-path', contextMenu.item)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy path to folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleFileAction('delete', contextMenu.item)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              ) : (
                // File options
                <>
                  <DropdownMenuItem onClick={() => handleFileAction('get-url', contextMenu.item)}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Get URL</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('rename', contextMenu.item)}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('move', contextMenu.item)}>
                    <Move className="mr-2 h-4 w-4" />
                    <span>Move</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('download', contextMenu.item)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleFileAction('delete', contextMenu.item)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <DataTableFooter 
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  )
} 