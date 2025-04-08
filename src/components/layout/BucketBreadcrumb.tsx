"use client"

import { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useBucketStore } from '@/store/bucketStore'
import { useAWSStore } from '@/store/aws-store'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export function BucketBreadcrumb() {
  const { currentBucket } = useBucketStore()
  const { activeProfile } = useAWSStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add a small delay to prevent flash of loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    },1)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Skeleton className="h-4 w-24" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-4 w-16" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-4 w-24" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-sm">
            {activeProfile ? activeProfile.profileName : 'Select Profile'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-sm">
            Buckets
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {currentBucket ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">
              {currentBucket}
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm text-muted-foreground">
              Select a bucket
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 