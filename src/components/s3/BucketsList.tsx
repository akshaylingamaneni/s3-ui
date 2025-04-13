'use client'

import { BucketItem } from '@/components/s3/BucketItem'
import { SidebarContent } from '@/components/ui/sidebar'
import { useBuckets } from '@/lib/hooks/useStorage'
import { useUser } from '@clerk/nextjs'
import { FolderIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface BucketsListProps {
  selectedProfile: string
}

export function BucketsList({ selectedProfile }: BucketsListProps) {
  const { isLoaded } = useUser()
  const { 
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useBuckets(selectedProfile)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  // Mark when initial loading is complete
  useEffect(() => {
    if (!isLoading && data) {
      setInitialLoadComplete(true)
    }
  }, [isLoading, data])

  if (!isLoaded || isLoading) {
    return (
      <SidebarContent>
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </SidebarContent>
    )
  }

  if (isError) {
    return (
      <SidebarContent>
        <div className="flex items-center justify-center p-4 text-sm text-red-500">
          <span>Error: {error instanceof Error ? error.message : 'Failed to load buckets'}</span>
        </div>
      </SidebarContent>
    )
  }

  const allBuckets = data?.pages.flatMap(page => page.buckets) ?? []

  return (
    <SidebarContent className="relative">
      {initialLoadComplete && allBuckets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-sm text-muted-foreground space-y-2">
          <FolderIcon className="h-10 w-10 opacity-40" />
          <span>No buckets available</span>
        </div>
      ) : (
        <div className="space-y-1">
          {allBuckets.map(bucket => (
            <BucketItem 
              key={`${bucket.name}-${bucket.region}`} 
              bucket={bucket}
            />
          ))}

          {/* Loading more trigger */}
          <div ref={ref} className="h-1">
            {isFetchingNextPage && (
              <div className="flex justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      )}
    </SidebarContent>
  )
}