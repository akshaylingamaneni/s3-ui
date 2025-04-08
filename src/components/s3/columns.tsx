"use client"

import { ColumnDef } from "@tanstack/react-table"
import { S3File } from "@/hooks/useS3Files"
import { FileIcon, FolderIcon } from "lucide-react"
import { formatSize, formatDate } from "@/lib/utils" // We'll move the format functions to utils

export const columns: ColumnDef<S3File>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
  },
  {
    accessorKey: "size",
    header: () => <div className="text-right hidden sm:block text-gray-700 dark:text-zinc-400">Size</div>,
    cell: ({ row }) => {
      if (row.original.isDirectory) return null
      return (
        <div className="text-right text-xs text-gray-600 dark:text-zinc-500 hidden sm:block">
          {formatSize(row.original.size)}
        </div>
      )
    },
  },
  {
    accessorKey: "lastModified",
    header: () => <div className="text-right hidden sm:block text-gray-700 dark:text-zinc-400">Modified</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right text-xs text-gray-600 dark:text-zinc-500 hidden sm:block">
          {formatDate(row.original.lastModified)}
        </div>
      )
    },
  },
] 