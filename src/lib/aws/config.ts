import { S3Client } from "@aws-sdk/client-s3";

export interface BucketCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

export function createS3Client(credentials: BucketCredentials) {
  return new S3Client({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });
} 