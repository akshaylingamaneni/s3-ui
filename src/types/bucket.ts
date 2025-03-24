export interface BucketConnection {
  id: string;
  name: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  createdAt: Date;
  lastAccessed?: Date;
  color?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface BucketStats {
  totalObjects: number;
  totalSize: number;
  lastModified?: Date;
}

export interface S3File {
  key: string;
  size: number;
  lastModified: Date;
  etag?: string;
  isDirectory: boolean;
} 