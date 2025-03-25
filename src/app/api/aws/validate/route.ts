import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const { accessKeyId, secretAccessKey } = await request.json();

    const client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    await client.send(new ListBucketsCommand({}));
    
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