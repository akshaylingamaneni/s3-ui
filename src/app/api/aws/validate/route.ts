import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '@/lib/aws/s3-client';
import { decrypt } from '@/lib/encryption';

export async function POST(request: Request) {
  try {
    const { 
      accessKeyId, 
      secretAccessKey, 
      endpoint, 
      region, 
      forcePathStyle,
      isEncrypted = false  // Add flag to know if key needs decryption
    } = await request.json();
    console.log("accessKeyId", accessKeyId);
    console.log("secretAccessKey", secretAccessKey);
    console.log("endpoint", endpoint);
    console.log("region", region);
    console.log("forcePathStyle", forcePathStyle);
    console.log("isEncrypted", isEncrypted);
    const client = await getS3Client({
      accessKeyId,
      secretAccessKey,
      endpoint,
      region,
      forcePathStyle,
      profileName: 'default'
    });

    const response = await client.send(new ListBucketsCommand({MaxBuckets: 1}));
    console.log("response", response);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json(
      { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
} 