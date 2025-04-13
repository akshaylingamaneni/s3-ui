import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AWSProfile {
  profileName: string
  region: string
  // add any other fields your profile has
}

interface AWSProfileStore {
  activeProfile: AWSProfile | null
  setActiveProfile: (profile: AWSProfile | null) => void
}

export const useAWSProfileStore = create<AWSProfileStore>((set) => ({
  activeProfile: null,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
}))