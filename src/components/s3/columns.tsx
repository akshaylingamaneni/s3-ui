"use client"

import { ColumnDef } from "@tanstack/react-table"
import { S3File } from "@/hooks/useS3Files"
import { FileIcon, FolderIcon } from "lucide-react"
import { formatSize, formatDate } from "@/lib/utils" // We'll move the format functions to utils
import { DataTableColumnHeader } from "./ColumnHeader"

export const columns: ColumnDef<S3File>[] = [
  {
    accessorKey: "name",
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
] 