"use client"

import { useS3Files } from '@/hooks/useS3Files'
import { useBucketStore } from '@/store/bucketStore'
import { columns } from '@/components/s3/columns'
import { DataTable } from '@/components/s3/DataTable'

export default function Page() {
  const { currentBucket } = useBucketStore()
  const {
    files,
    isLoading,
  } = useS3Files(currentBucket)

  return (
    <div className="flex flex-col gap-4">
      {/* todo: need to figure out what dashboard should look like */}
      {/* First item: Flex row with 3 items */}
      {/* <div className="flex flex-row justify-around flex-none">
        <div className="p-4 bg-zinc-800/40 aspect-video rounded-lg">Item 1</div>
        <div className="p-4 bg-zinc-800/40 aspect-video rounded-lg">Item 2</div>
        <div className="p-4 bg-zinc-800/40 aspect-video rounded-lg">Item 3</div>
      </div> */}

      {/* Second item: DataTable */}
      <div className="flex-1 mx-4">
        <DataTable columns={columns} data={files || []} />
      </div>
    </div>
  )
}
