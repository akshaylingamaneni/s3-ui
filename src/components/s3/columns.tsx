"use client"

import { ColumnDef } from "@tanstack/react-table"
import { S3File } from "@/hooks/useS3Files"
import { FileIcon, FolderIcon, MoreHorizontal } from "lucide-react"
import { formatSize, formatDate } from "@/lib/utils" // We'll move the format functions to utils
import { DataTableColumnHeader } from "./ColumnHeader"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileEdit, Download, Copy, Trash, Link, Move } from "lucide-react"

export const columns = (handleFileAction: (action: string, item: any) => void): ColumnDef<S3File>[] => [
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <div className="flex items-center">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4 max-w-[300px] sm:max-w-[400px] md:max-w-none">
            {row.original.isDirectory ? (
                <FolderIcon className="h-5 w-5 text-gray-500 dark:text-zinc-500 shrink-0" />
            ) : (
                <FileIcon className="h-5 w-5 text-gray-500 dark:text-zinc-500 shrink-0" />
            )}
            <span className="text-sm text-gray-900 dark:text-zinc-300 truncate">
              {row.original.name}
            </span>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => rowA.original.name.localeCompare(rowB.original.name),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <div className="flex justify-end hidden sm:flex">
        <DataTableColumnHeader column={column} title="Size" />
      </div>
    ),
    cell: ({ row }) => {
      if (row.original.isDirectory) return null
      return (
        <div className="text-right text-xs text-gray-600 dark:text-zinc-500 hidden sm:block pr-6">
          {formatSize(row.original.size)}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      if (rowA.original.isDirectory && !rowB.original.isDirectory) return -1
      if (!rowA.original.isDirectory && rowB.original.isDirectory) return 1
      return (rowA.original.size || 0) - (rowB.original.size || 0)
    },
  },
  {
    accessorKey: "lastModified",
    header: ({ column }) => (
      <div className="flex justify-end hidden sm:flex">
        <DataTableColumnHeader column={column} title="Modified" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right text-xs text-gray-600 dark:text-zinc-500 hidden sm:block pr-6">
          {formatDate(row.original.lastModified)}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.lastModified).getTime()
      const dateB = new Date(rowB.original.lastModified).getTime()
      return dateA - dateB
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ column }) => (
      <div className="flex justify-end hidden sm:flex">
        <DataTableColumnHeader column={column} title="Action" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div 
          className="text-right pr-4"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {row.original.isDirectory ? (
                // Folder options
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('rename', row.original);
                  }}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('download', row.original)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('copy-path', row.original)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy path to folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleFileAction('delete', row.original)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              ) : (
                // File options
                <>
                  <DropdownMenuItem onClick={() => handleFileAction('get-url', row.original)}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Get URL</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('rename', row.original);
                  }}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('move', row.original)}>
                    <Move className="mr-2 h-4 w-4" />
                    <span>Move</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFileAction('download', row.original)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleFileAction('delete', row.original)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
] 