export type BucketVisibility = 'public' | 'private'
export type ViewMode = 'grid' | 'list'
export type SortBy = 'name' | 'size' | 'date' | 'type'
export type SortOrder = 'asc' | 'desc'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface BucketConfig {
  id: string
  name: string
  region: string
  visibility: BucketVisibility
  accessKeyId?: string
  secretAccessKey?: string
  
  // Optional configurations
  color?: string
  tags?: string[]
  isFavorite?: boolean
  description?: string
  
  // Metadata
  createdAt: number
  updatedAt: number
  lastAccessed?: number
  
  // Bucket specific settings
  defaultPrefix?: string
  customEndpoint?: string
  corsEnabled?: boolean
}

export interface UserPreferences {
  // Display preferences
  theme: ThemeMode
  viewMode: ViewMode
  sortBy: SortBy
  sortOrder: SortOrder
  
  // Layout preferences
  showHiddenFiles: boolean
  thumbnailPreview: boolean
  compactView: boolean
  
  // Bucket preferences
  recentBuckets: string[] // Array of recently accessed bucket IDs
  favoriteBuckets: string[] // Array of favorite bucket IDs
  defaultRegion: string
  
  // Performance preferences
  pageSize: number // Number of items to load per page
  preloadThumbnails: boolean
  
  // Created/Updated timestamps
  createdAt: number
  updatedAt: number
}

// Default preferences that can be used when initializing a new user
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  viewMode: 'list',
  sortBy: 'name',
  sortOrder: 'asc',
  showHiddenFiles: false,
  thumbnailPreview: true,
  compactView: false,
  recentBuckets: [],
  favoriteBuckets: [],
  defaultRegion: 'us-east-1',
  pageSize: 50,
  preloadThumbnails: true,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

// Helper type for creating a new bucket
export interface CreateBucketConfig extends Omit<BucketConfig, 'id' | 'createdAt' | 'updatedAt'> {
  name: string
  region: string
  visibility: BucketVisibility
  accessKeyId: string
  secretAccessKey: string
}

export interface AWSCredentials {
  profileName: string
  accessKeyId: string
  secretAccessKey: string
}