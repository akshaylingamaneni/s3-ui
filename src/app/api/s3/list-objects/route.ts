import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { AWSProfile, createS3Client } from '@/lib/aws/s3-client'
import { currentUser } from '@clerk/nextjs/server'
import redis from '@/lib/redis'
import { decrypt } from '@/lib/encryption'

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const bucket = searchParams.get('bucket')
  const profileName = searchParams.get('profile')
  const continuationToken = searchParams.get('continuationToken')
  
  if (!bucket) {
    return NextResponse.json(
      { error: 'Bucket name is required' }, 
      { status: 400 }
    )
  }

  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const profiles: AWSProfile[] | null = await redis.get(`aws_credentials:${user.id}`)
    const profile = profiles?.find((p) => p.profileName === profileName)
    console.log("profile", profile)
    console.log("profileName", profileName)
    // Validate AWS credentials
    if (!profile || !profile.accessKeyId || !profile.secretAccessKey) {
      return NextResponse.json(
        { error: 'Invalid or missing AWS credentials' },
        { status: 402 }
      )
    }
    const decryptedSecretAccessKey = await decrypt(profile.secretAccessKey)
    // Create S3 client
    const client = createS3Client({
      accessKeyId: profile.accessKeyId,
      secretAccessKey: decryptedSecretAccessKey,
      region: profile.region || 'us-east-1',
      profileName: profile.profileName || '',
      endpoint: profile.endpoint || '',
      forcePathStyle: profile.forcePathStyle || false,
    })
    console.log("client", decryptedSecretAccessKey)

    // Set up the ListObjectsV2Command
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 100,
      ContinuationToken: continuationToken || undefined,
      Delimiter: '/' // Use delimiter to handle folders
    })
    console.log("command", command)

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
      { error: 'Failed to list objects', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 