'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'
import { S3File } from '@/hooks/useS3Files'
import { Loader2 } from 'lucide-react'

interface FileGridViewProps {
  files: S3File[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isLoading: boolean
}

export function FileGridView({ files, fetchNextPage, hasNextPage, isLoading }: FileGridViewProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: hasNextPage ? files.length + 1 : files.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45, // Height of each row
    overscan: 10,
  })
  
  // Load more when scrolling to the bottom
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()
    
    if (
      lastItem && 
      lastItem.index >= files.length - 1 && 
      hasNextPage && 
      !isLoading
    ) {
      fetchNextPage()
    }
  }, [virtualizer.getVirtualItems(), files.length, fetchNextPage, hasNextPage, isLoading])
  
  return (
    <div className="w-full h-[calc(100dvh-200px)] flex flex-col bg-zinc-800/40 rounded-lg px-4 py-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center pb-2 border-b border-zinc-700/50 text-sm text-zinc-400 font-medium">
        <div className="p-3 w-8">
          {/* Icon column */}
        </div>
        <div className="flex-1">
          Name
        </div>
        <div className="w-24 text-right px-3">
          Size
        </div>
        <div className="w-24 text-right px-3">
          Modified
        </div>
      </div>
      
      {/* Scrollable container */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-auto"
        style={{ height: "100%" }}
      >
        {files.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index >= files.length
              const file = isLoaderRow ? null : files[virtualRow.index]
              
              return (
                <div
                  key={isLoaderRow ? 'loader' : file?.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-sm">Loading more...</span>
                    </div>
                  ) : (
                    file && <FileGridItem file={file} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Individual file item 
function FileGridItem({ file }: { file: S3File }) {
  return (
    <div className="hover:bg-zinc-800 cursor-pointer transition-colors flex items-center w-full border-b border-zinc-800/40 h-full">
      <div className="p-3">
        {file.isDirectory ? (
          <FolderIcon className="h-5 w-5 text-zinc-500" />
        ) : (
          <FileIcon className="h-5 w-5 text-zinc-500" />
        )}
      </div>
      <div className="flex-1 truncate pr-3">
        <div className="truncate text-sm text-zinc-300">{file.name}</div>
      </div>
      {!file.isDirectory && (
        <>
          <div className="w-24 text-right px-3 text-xs text-zinc-500">{formatSize(file.size)}</div>
          <div className="w-24 text-right px-3 text-xs text-zinc-500">{formatDate(file.lastModified)}</div>
        </>
      )}
    </div>
  )
}

// Helper icons
function FolderIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  )
}

function FileIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

// Helper function to format file size
function formatSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}