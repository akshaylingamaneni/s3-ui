import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const { 
      accessKeyId, 
      secretAccessKey, 
      endpoint, 
      region, 
      forcePathStyle 
    } = await request.json();
    console.log("accessKeyId", accessKeyId);
    console.log("secretAccessKey", secretAccessKey);
    console.log("endpoint", endpoint);
    console.log("region", region);
    console.log("forcePathStyle", forcePathStyle);

    const client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: endpoint || undefined,
      region: region || 'us-east-1',
      forcePathStyle: forcePathStyle || false
    });

    const response = await client.send(new ListBucketsCommand({}));
    console.log(response);
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