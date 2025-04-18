import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '@/lib/aws/s3-client';
import { decrypt, encrypt } from '@/lib/encryption';

export async function POST(request: Request) {
  try {
    const { 
      accessKeyId, 
      secretAccessKey, 
      endpoint, 
      region, 
      forcePathStyle,
    } = await request.json();
    const encryptedSecretAccessKey = await encrypt(secretAccessKey);
    const client = await getS3Client({
      accessKeyId,
      secretAccessKey: encryptedSecretAccessKey,
      endpoint,
      region,
      forcePathStyle,
      profileName: 'default'
    });

    const response = await client.send(new ListBucketsCommand({MaxBuckets: 1}));
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