import { S3File } from "@/hooks/useS3Files"

interface FileListItemProps {
  file: S3File
}

export function FileListItem({ file }: FileListItemProps) {
  return (
    <div className="flex items-center p-4 hover:bg-muted/70 cursor-pointer">
      {/* Add file icon based on type */}
      <span className="ml-2">{file.name}</span>
      <span className="ml-auto">{file.size}</span>
      <span className="ml-4">{file.lastModified}</span>
    </div>
  )
} 