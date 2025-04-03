import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { createS3Client } from '@/lib/aws/s3-client'

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const bucket = searchParams.get('bucket')
  const continuationToken = searchParams.get('continuationToken')
  
  if (!bucket) {
    return NextResponse.json(
      { error: 'Bucket name is required' }, 
      { status: 400 }
    )
  }

  try {
    // Create S3 client
    const client = createS3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      profileName: process.env.AWS_PROFILE_NAME || 'default',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    })

    // Set up the ListObjectsV2Command
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 100,
      ContinuationToken: continuationToken || undefined,
      Delimiter: '/' // Use delimiter to handle folders
    })

    // Execute the command
    const response = await client.send(command)
    
    // Process directories
    const directories = (response.CommonPrefixes || []).map((prefix) => ({
      name: prefix.Prefix?.split('/').filter(Boolean).pop() || '',
      size: 0,
      lastModified: new Date().toISOString(),
      key: prefix.Prefix || '',
      isDirectory: true,
    }))
    
    // Process files
    const files = (response.Contents || []).map((item) => ({
      name: item.Key?.split('/').pop() || '',
      size: item.Size || 0,
      lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
      key: item.Key || '',
      isDirectory: false,
    }))
    
    // Return formatted response
    return NextResponse.json({
      files: [...directories, ...files],
      nextCursor: response.NextContinuationToken 
        ? { continuationToken: response.NextContinuationToken } 
        : null,
    })
  } catch (error) {
    console.error('Error listing S3 objects:', error)
    return NextResponse.json(
      { error: 'Failed to list objects' },
      { status: 500 }
    )
  }
} 