'use client'

import { useBuckets, useStorage } from '@/lib/hooks/useStorage'
import { BucketItem } from '@/components/s3/BucketItem'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { SidebarContent } from '@/components/ui/sidebar'
import { useUser } from '@clerk/nextjs'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

export function BucketsList() {
  const { isLoaded } = useUser()
  const { 
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useBuckets()

  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
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
      {allBuckets.length === 0 && !isLoading && (
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          <span>No buckets found</span>
        </div>
      )}
      
      <div className={cn(
        "space-y-1",
        isLoading && "opacity-50"
      )}>
        {allBuckets.map(bucket => (
          <BucketItem 
            key={bucket.id} 
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
    </SidebarContent>
  )
}