import { FolderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
  actionLabel?: string
}

export function EmptyState({
  title = "No bucket selected",
  description = "Select a bucket to view its contents",
  onAction,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] bg-neutral-800/40 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-neutral-900/50 p-4">
          <FolderIcon className="h-8 w-8 text-zinc-400" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-zinc-100">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 text-center max-w-sm">
            {description}
          </p>
        </div>
        {onAction && actionLabel && (
          <Button
            variant="outline"
            onClick={onAction}
            className="mt-2"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
} 