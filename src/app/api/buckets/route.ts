import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'
import { decrypt } from '@/lib/encryption'
import redis from '@/lib/redis'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { profile, cursor, limit } = await request.json()
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile is required' },
        { status: 400 }
      )
    }

    // Get the full profile from Redis to get the encrypted secret key
    const credentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []
    console.log("credentials", credentials)
    const fullProfile = credentials.find(cred => cred.profileName === profile.profileName)

    if (!fullProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Decrypt the secret key
    const secretAccessKey = await decrypt(fullProfile.secretAccessKey)
    
    const client = new S3Client({
      credentials: {
        accessKeyId: profile.accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      endpoint: profile.endpoint || undefined,
      region: profile.region,
      forcePathStyle: profile.forcePathStyle
    })

    const command = new ListBucketsCommand({})
    const response = await client.send(command)

    const buckets = response.Buckets?.map(bucket => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate,
      region: profile.region,
      visibility: 'private' // You might want to check actual bucket policy
    })) || []

    return NextResponse.json({
      buckets,
      success: true
    })
  } catch (error) {
    console.error('Error listing buckets:', error)
    return NextResponse.json(
      { error: 'Failed to list buckets' },
      { status: 500 }
    )
  }
}
