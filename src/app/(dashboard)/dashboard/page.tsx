"use client"

import { useS3Files } from '@/hooks/useS3Files'
import { useBucketStore } from '@/store/bucketStore'
import { columns } from '@/components/s3/columns'
import { DataTable } from '@/components/s3/DataTable'
import { EmptyState } from '@/components/s3/EmptyState'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAWSStore } from '@/store/aws-store'

export default function Page() {
  const { currentBucket } = useBucketStore()
  const { activeProfile } = useAWSStore()
  const {
    files,
    isLoading,
  } = useS3Files(currentBucket, activeProfile?.profileName)

  return (
    <div className="flex flex-col gap-4">

      {/* Content area */}
      <div className="flex-1 mx-4">
        {!currentBucket ? (
          <EmptyState />
        ) : files && files.length === 0 && !isLoading ? (
          <EmptyState 
            title="Empty bucket"
            description="This bucket has no files or folders"
            actionLabel="Upload files"
            onAction={() => {
              // TODO: Implement file upload
              console.log('Upload files')
            }}
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={files || []} 
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
