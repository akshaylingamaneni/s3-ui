import { AWSProfile } from '@/lib/aws/s3-client'
import { useInfiniteQuery } from '@tanstack/react-query'

// Define the types for the S3 objects response
interface S3ObjectsResponse {
  files: S3File[]
  nextCursor: PaginationToken | null
}

// Define pagination token type
interface PaginationToken {
  continuationToken: string
}

export interface S3File {
  name: string
  size: number
  lastModified: string
  key: string
  isDirectory: boolean
}

export function useS3Files(bucketName: string | null, activeProfile: string | undefined, currentPath: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['s3-files', bucketName, currentPath],
    queryFn: async ({ pageParam }) => {
      if (!bucketName) throw new Error('Bucket name is required')
      console.log('currentPath', currentPath)
      const params = new URLSearchParams()
      if (pageParam && typeof pageParam === 'object' && 'continuationToken' in pageParam) {
        params.append('continuationToken', (pageParam as PaginationToken).continuationToken)
        params.append('prefix', currentPath)
      }
      console.log('params', params)
      const response = await fetch(`/api/s3/list-objects?bucket=${bucketName}&${params}&prefix=${currentPath}&profile=${activeProfile}`)
      if (!response.ok) {
        throw new Error('Failed to fetch objects')
      }
      console.log('response', response)
      return response.json()
    },
    getNextPageParam: (lastPage: S3ObjectsResponse) => lastPage.nextCursor,
    enabled: !!bucketName,
    initialPageParam: null
  })

  const files = data?.pages.flatMap(page => (page as S3ObjectsResponse).files) ?? []
  console.log('files', files)
  return {
    files,
    fetchNextPage,
    hasNextPage,
    isLoading,
  }
} 