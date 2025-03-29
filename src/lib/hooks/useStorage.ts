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
      console.log("data", data)
      if (!data.success) throw new Error('Failed to fetch profiles')
      return data.profiles
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useBuckets() {
  const { data: profiles } = useAWSProfiles()

  return useInfiniteQuery<BucketData>({
    queryKey: ['buckets', profiles],
    queryFn: async ({ pageParam = '' }) => {
      if (!profiles?.length) {
        return { buckets: [], nextCursor: undefined }
      }

      // Fetch buckets from all profiles
      const bucketsPromises = profiles.map(async (profile) => {
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
          if (!res.ok) throw new Error(`Failed to fetch buckets for ${profile.profileName}`)
          const data = await res.json()
          return {
            profileName: profile.profileName,
            buckets: data.buckets
          }
        } catch (error) {
          console.error(`Error fetching buckets for ${profile.profileName}:`, error)
          return {
            profileName: profile.profileName,
            buckets: []
          }
        }
      })

      const results = await Promise.all(bucketsPromises)
      
      // Combine all buckets and add profile information
      const allBuckets = results.flatMap(result => 
        result.buckets.map((bucket: BucketConfig) => ({
          ...bucket,
          profileName: result.profileName // Add profile name to each bucket
        }))
      )

      return {
        buckets: allBuckets,
        nextCursor: undefined // Pagination might need to be handled differently for multiple profiles
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!profiles?.length
  })
} 