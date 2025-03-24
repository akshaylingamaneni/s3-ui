import { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { encrypt, decrypt } from "@/lib/encryption";

export interface BucketConnectionMethod {
  type: 'iam_user' | 'sts' | 'sso';
  // For IAM User
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  // For STS
  roleArn?: string;
  // For SSO
  ssoRegion?: string;
  ssoStartUrl?: string;
}

export interface BucketPermissions {
  canList: boolean;
  canUpload: boolean;
  canDownload: boolean;
  canDelete: boolean;
  canCreateFolders: boolean;
}

export interface BucketDiscoveryOptions {
  listAllBuckets?: boolean;
  bucketNames?: string[];
  region?: string;
}

export interface AccessibleBucket {
  bucket: string;
  permissions: BucketPermissions;
}

export class AWSCredentialsManager {
  private static instance: AWSCredentialsManager;
  private credentials: Map<string, BucketConnectionMethod> = new Map();

  private constructor() {}

  static getInstance(): AWSCredentialsManager {
    if (!AWSCredentialsManager.instance) {
      AWSCredentialsManager.instance = new AWSCredentialsManager();
    }
    return AWSCredentialsManager.instance;
  }

  async validateCredentials(credentials: BucketConnectionMethod): Promise<boolean> {
    try {
      const client = this.createS3Client(credentials);
      await client.send(new ListBucketsCommand({}));
      return true;
    } catch (error) {
      console.error("Credential validation failed:", error);
      return false;
    }
  }

  async discoverAccessibleBuckets(
    credentials: BucketConnectionMethod,
    options: BucketDiscoveryOptions
  ): Promise<AccessibleBucket[]> {
    const client = this.createS3Client(credentials);
    const accessibleBuckets: AccessibleBucket[] = [];

    try {
      // List all buckets if requested
      if (options.listAllBuckets) {
        const response = await client.send(new ListBucketsCommand({}));
        const buckets = response.Buckets || [];
        
        for (const bucket of buckets) {
          if (bucket.Name) {
            const permissions = await this.validateBucketPermissions(client, bucket.Name);
            accessibleBuckets.push({
              bucket: bucket.Name,
              permissions
            });
          }
        }
      }
      // Check specific buckets
      else if (options.bucketNames?.length) {
        for (const bucketName of options.bucketNames) {
          const permissions = await this.validateBucketPermissions(client, bucketName);
          accessibleBuckets.push({
            bucket: bucketName,
            permissions
          });
        }
      }

      return accessibleBuckets;
    } catch (error) {
      console.error("Error discovering buckets:", error);
      throw error;
    }
  }

  private async validateBucketPermissions(
    client: S3Client,
    bucket: string
  ): Promise<BucketPermissions> {
    const permissions: BucketPermissions = {
      canList: false,
      canUpload: false,
      canDownload: false,
      canDelete: false,
      canCreateFolders: false
    };

    try {
      // Test list permission
      await client.send(new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 1
      }));
      permissions.canList = true;
    } catch (error) {
      console.warn(`Cannot list objects in bucket ${bucket}:`, error);
    }

    try {
      // Test upload permission
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: '.test-permissions',
        Body: Buffer.from('test')
      }));
      permissions.canUpload = true;
      permissions.canCreateFolders = true;
      
      // Clean up test file
      await client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: '.test-permissions'
      }));
    } catch (error) {
      console.warn(`Cannot upload to bucket ${bucket}:`, error);
    }

    return permissions;
  }

  private createS3Client(credentials: BucketConnectionMethod): S3Client {
    if (credentials.type === 'iam_user') {
      return new S3Client({
        credentials: {
          accessKeyId: credentials.accessKeyId!,
          secretAccessKey: credentials.secretAccessKey!
        },
        region: credentials.region
      });
    }
    // Add support for STS and SSO later
    throw new Error('Unsupported credential type');
  }

  async saveCredentials(bucketId: string, credentials: BucketConnectionMethod): Promise<void> {
    // Encrypt sensitive data before storing
    const encryptedCredentials = {
      ...credentials,
      secretAccessKey: credentials.secretAccessKey ? await encrypt(credentials.secretAccessKey) : undefined
    };
    this.credentials.set(bucketId, encryptedCredentials);
  }

  async getCredentials(bucketId: string): Promise<BucketConnectionMethod | undefined> {
    const credentials = this.credentials.get(bucketId);
    if (!credentials) return undefined;

    // Decrypt sensitive data
    return {
      ...credentials,
      secretAccessKey: credentials.secretAccessKey ? await decrypt(credentials.secretAccessKey) : undefined
    };
  }

  async removeCredentials(bucketId: string): Promise<void> {
    this.credentials.delete(bucketId);
  }
} 