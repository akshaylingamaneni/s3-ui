import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { BucketConfig, UserPreferences, AWSCredentials } from '@/types/storage'

interface StorageData {
  buckets: BucketConfig[]
  nextCursor?: string
  preferences: UserPreferences | null
}

interface BucketData {
  buckets: BucketConfig[]
  nextCursor?: string
}

interface ProfileBuckets {
  profileName: string
  buckets: BucketConfig[]
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

export function useAWSProfiles() {
  return useQuery<AWSCredentials[]>({
    queryKey: ['aws-profiles'],
    queryFn: async () => {
      const response = await fetch('/api/aws/get-profiles')
      const data = await response.json()
      if (!data.success) throw new Error('Failed to fetch profiles')
      return data.profiles
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useBuckets(profile?: string) {
  return useInfiniteQuery<BucketData>({
    queryKey: ['buckets', profile],
    queryFn: async ({ pageParam = '' }) => {
      try {
        const res = await fetch('/api/buckets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile,
            cursor: pageParam,
            limit: PAGE_SIZE
          })
        })
        if (!res.ok) throw new Error(`Failed to fetch buckets for ${profile}`)
        const data = await res.json()
        
        // Add profile name to each bucket
        const buckets = data.buckets.map((bucket: BucketConfig) => ({
          ...bucket,
          profileName: profile
        }))

        return {
          buckets,
          nextCursor: data.nextCursor
        }
      } catch (error) {
        console.error(`Error fetching buckets for ${profile}:`, error)
        throw error
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!profile,
    retry: 3,
    retryDelay: 1000
  })
} 