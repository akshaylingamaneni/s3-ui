import { S3Client } from "@aws-sdk/client-s3";
import { decrypt } from "../encryption";

// Client cache by profile
const clientCache: Record<string, S3Client> = {};

export interface AWSProfile {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  profileName: string;
}

export async function getS3Client(profile: AWSProfile): Promise<S3Client> {
  const cacheKey = profile.profileName;
  
  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  
  try {
    const secretAccessKeyDecrypted = await decrypt(profile.secretAccessKey);
    const client = new S3Client({
      credentials: {
        accessKeyId: profile.accessKeyId,
        secretAccessKey: secretAccessKeyDecrypted,
      },
      endpoint: profile.endpoint || undefined,
      region: profile.region,
      forcePathStyle: profile.forcePathStyle
    });
    
    clientCache[cacheKey] = client;
    return client;
  } catch (error) {
    console.error(`Failed to decrypt credentials for profile ${profile.profileName}`);
    throw new Error("Authentication error: Unable to decrypt credentials");
  }
} 