import { S3Client } from "@aws-sdk/client-s3";

export interface AWSProfile {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  profileName: string;
}

export function createS3Client(profile: AWSProfile) {
  return new S3Client({
    credentials: {
      accessKeyId: profile.accessKeyId,
      secretAccessKey: profile.secretAccessKey,
    },
    endpoint: profile.endpoint || undefined,
    region: profile.region,
    forcePathStyle: profile.forcePathStyle
  });
} 