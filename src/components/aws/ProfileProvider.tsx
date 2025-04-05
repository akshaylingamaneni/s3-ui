'use client'

import * as React from 'react'
import { useAWSStore } from '@/store/aws-store'
import { Loader2 } from 'lucide-react'

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true)
  const { setActiveProfile } = useAWSStore()

  React.useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch('/api/aws/get-profiles')
        const data = await response.json()
        if (data.success && data.profiles && data.profiles.length > 0) {
          setActiveProfile(data.profiles[0])
        }
      } catch (error) {
        console.error('Failed to load profiles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [setActiveProfile])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return children
} 