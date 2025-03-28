import { create } from 'zustand'

interface BucketState {
  currentBucket: string | null
  setCurrentBucket: (bucket: string | null) => void
}

export const useBucketStore = create<BucketState>((set) => ({
  currentBucket: null,
  setCurrentBucket: (bucket) => set({ currentBucket: bucket }),
})) 