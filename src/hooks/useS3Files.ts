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

export function useS3Files(bucketName: string | null, activeProfile: string | undefined) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['s3-files', bucketName],
    queryFn: async ({ pageParam }) => {
      if (!bucketName) throw new Error('Bucket name is required')
      
      const params = new URLSearchParams()
      if (pageParam && typeof pageParam === 'object' && 'continuationToken' in pageParam) {
        params.append('continuationToken', (pageParam as PaginationToken).continuationToken)
      }
      
      const response = await fetch(`/api/s3/list-objects?bucket=${bucketName}&${params}&profile=${activeProfile}`)
      if (!response.ok) {
        throw new Error('Failed to fetch objects')
      }
      
      return response.json()
    },
    getNextPageParam: (lastPage: S3ObjectsResponse) => lastPage.nextCursor,
    enabled: !!bucketName,
    initialPageParam: null
  })

  const files = data?.pages.flatMap(page => (page as S3ObjectsResponse).files) ?? []

  return {
    files,
    fetchNextPage,
    hasNextPage,
    isLoading,
  }
} 