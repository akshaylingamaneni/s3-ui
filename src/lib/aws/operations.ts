import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { BucketConnection, S3File } from "@/types/bucket";
import { getS3Client } from "./s3-client";

interface BucketConnectionMethod {
  type: 'iam_user' | 'sts' | 'sso';
  // For IAM User
  accessKeyId?: string;
  secretAccessKey?: string;
  // For STS
  roleArn?: string;
  // For SSO
  ssoRegion?: string;
  ssoStartUrl?: string;
}

interface BucketPermissions {
  canList: boolean;
  canUpload: boolean;
  canDownload: boolean;
  canDelete: boolean;
  canCreateFolders: boolean;
}

interface BucketDiscoveryOptions {
  // List all buckets the user has access to
  listAllBuckets?: boolean;
  // Specific bucket names to check access for
  bucketNames?: string[];
  // AWS region to check in
  region?: string;
}

async function discoverAccessibleBuckets(
  credentials: BucketConnectionMethod,
  options: BucketDiscoveryOptions
): Promise<{
  bucket: string;
  permissions: BucketPermissions;
}[]> {
  // TODO: Implement bucket discovery
  return [];
}

interface SetupGuideStep {
  title: string;
  instructions: string[];
  validationCheck?: () => Promise<boolean>;
}

const setupSteps: SetupGuideStep[] = [
  {
    title: "Create IAM User",
    instructions: [
      "1. Go to AWS IAM Console",
      "2. Create new IAM user",
      "3. Enable programmatic access",
      "4. Attach S3 permissions"
    ]
  },
  {
    title: "Configure Bucket Policy",
    instructions: [
      "1. Go to S3 Console",
      "2. Select bucket",
      "3. Add bucket policy",
      "4. Test access"
    ]
  }
  // ... more steps
];

export class S3Operations {
  private client: S3Client | null = null;
  private bucket: string;

  constructor(connection: BucketConnection) {
    this.bucket = connection.bucket;
  }

  async initialize(): Promise<void> {
    this.client = await getS3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      profileName: process.env.AWS_PROFILE_NAME || 'default',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    });
  }

  private ensureInitialized(): void {
    if (!this.client) {
      throw new Error("S3Operations not initialized. Call initialize() before using this instance.");
    }
  }

  async listFiles(prefix: string = ""): Promise<S3File[]> {
    this.ensureInitialized();
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        Delimiter: "/",
      });

      const response = await this.client!.send(command);
      const files: S3File[] = [];

      // Handle directories (CommonPrefixes)
      response.CommonPrefixes?.forEach((prefix) => {
        if (prefix.Prefix) {
          files.push({
            key: prefix.Prefix,
            size: 0,
            lastModified: new Date(),
            isDirectory: true,
          });
        }
      });

      // Handle files
      response.Contents?.forEach((item) => {
        if (item.Key && !item.Key.endsWith("/")) {
          files.push({
            key: item.Key,
            size: item.Size || 0,
            lastModified: item.LastModified || new Date(),
            etag: item.ETag,
            isDirectory: false,
          });
        }
      });

      return files;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  async uploadFile(key: string, file: File): Promise<void> {
    this.ensureInitialized();
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: file.type,
      });

      await this.client!.send(command);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async downloadFile(key: string): Promise<Blob> {
    this.ensureInitialized();
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client!.send(command);
      if (!response.Body) {
        throw new Error("Empty response body");
      }

      return new Blob([await response.Body.transformToByteArray()]);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    this.ensureInitialized();
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client!.send(command);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
} 