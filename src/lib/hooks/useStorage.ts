import { useInfiniteQuery } from '@tanstack/react-query'
import type { BucketConfig, UserPreferences } from '@/types/storage'

interface StorageData {
  buckets: BucketConfig[]
  nextCursor?: string
  preferences: UserPreferences | null
}

interface BucketData {
  buckets: BucketConfig[]
  nextCursor?: string
}

const PAGE_SIZE = 20

export function useStorage() {
  return useInfiniteQuery<StorageData>({
    queryKey: ['storage'],
    queryFn: async ({ pageParam = '' }) => {
      const res = await fetch(`/api/storage?cursor=${pageParam}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error('Failed to fetch storage')
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
    // Only refetch if user explicitly requests it
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
} 

export function useBuckets() {
  return useInfiniteQuery<BucketData>({
    queryKey: ['buckets'],
    queryFn: async ({ pageParam = '' }) => {
      const res = await fetch(`/api/buckets?cursor=${pageParam}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error('Failed to fetch buckets')
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
} 