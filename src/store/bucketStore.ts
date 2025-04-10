import { create } from 'zustand'

interface BucketState {
  currentBucket: string | null
  currentPath: string | null
  setCurrentBucket: (bucket: string | null) => void
  setCurrentPath: (path: string | null) => void
}

export const useBucketStore = create<BucketState>((set) => ({
  currentBucket: null,
  currentPath: null,
  setCurrentBucket: (bucket) => set({ currentBucket: bucket }),
  setCurrentPath: (path) => set({ currentPath: path }),
})) 