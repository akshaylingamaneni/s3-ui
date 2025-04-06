import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AWSProfile {
  profileName: string
  region: string
  // add any other fields your profile has
}

interface AWSStore {
  activeProfile: AWSProfile | null
  setActiveProfile: (profile: AWSProfile | null) => void
}

export const useAWSStore = create<AWSStore>()(
  persist(
    (set, get) => ({
      activeProfile: null,
      setActiveProfile: (profile) => {
        set({ activeProfile: profile })
      },
    }),
    {
      name: 'aws-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
      },
    }
  )
)

// Add a debug subscriber
// useAWSStore.subscribe((state) => {
//   console.log('Store changed:', state)
// }) 