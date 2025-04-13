"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  isLoading?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  isLoading,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (isLoading || !column.getCanSort()) {
    return <div className="text-sm font-medium text-gray-700 dark:text-zinc-400">{title}</div>
  }

  const sortState = column.getIsSorted();

  let IconComponent = ChevronsUpDown;
  let tooltipText = "Sort Ascending";
  if (sortState === 'asc') {
    IconComponent = ArrowUp;
    tooltipText = "Sort Descending";
  } else if (sortState === 'desc') {
    IconComponent = ArrowDown;
    tooltipText = "Clear Sorting";
  }

  const handleSortToggle = () => {
    if (sortState === 'asc') {
      column.toggleSorting(true);
    } else if (sortState === 'desc') {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-700 dark:text-zinc-400">{title}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={handleSortToggle}
          >
            <IconComponent className="h-3.5 w-3.5" />
            <span className="sr-only">{tooltipText}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
} 