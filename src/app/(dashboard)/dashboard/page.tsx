"use client"
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useS3Files } from '@/hooks/useS3Files'
import { FileListItem } from '@/components/s3/FileListItem'
import { useBucketStore } from '@/store/bucketStore'

export default function Page() {
  const parentRef = useRef<HTMLDivElement>(null)
  const { currentBucket } = useBucketStore()
  
  const {
    files,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useS3Files(currentBucket)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? files.length + 1 : files.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {!currentBucket ? (
        // Show summary dashboard when no bucket is selected
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      ) : (
        // Show bucket contents when bucket is selected
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{currentBucket}</h2>
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          </div>
          
          <div 
            ref={parentRef}
            className="bg-muted/50 flex-1 rounded-xl overflow-auto"
            style={{ height: 'calc(100vh - 150px)' }}
          >
            {files.length === 0 && !isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No files found</p>
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const isLoaderRow = virtualRow.index > files.length - 1
                  const file = files[virtualRow.index]

                  return (
                    <div
                      key={virtualRow.index}
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
                        hasNextPage ? (
                          <div className="flex items-center justify-center p-4" 
                               onClick={() => fetchNextPage()}>
                            Loading more...
                          </div>
                        ) : null
                      ) : (
                        <FileListItem file={file} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
