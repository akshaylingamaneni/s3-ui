import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getS3Client } from '@/lib/aws/s3-client'
export async function POST(req: Request) {
  try {
    const { bucketName } = await req.json()
    
    const client = await getS3Client({
      region: 'us-east-1',
      forcePathStyle: false,
      profileName: 'default',
      accessKeyId: '',
      secretAccessKey: ''
    })

    try {
      // List more objects and don't use delimiter to see full structure
      const response = await client.send(new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 100, // Increased to show more items
        // Removed Delimiter to show full structure
      }))

      if (response.Contents || response.CommonPrefixes) {
        return NextResponse.json({ 
          isAccessible: true,
          contents: response.Contents,
          commonPrefixes: response.CommonPrefixes,
          isTruncated: response.IsTruncated,
          nextContinuationToken: response.NextContinuationToken
        })
      } else {
        return NextResponse.json({ 
          isAccessible: false,
          error: "Bucket is empty or not accessible"
        })
      }
    } catch (error: any) {
      console.error('S3 Error:', error)
      return NextResponse.json({ 
        isAccessible: false,
        error: error.message || "Bucket is not publicly accessible"
      })
    }
  } catch (error) {
    console.error('Request Error:', error)
    return NextResponse.json({ 
      isAccessible: false,
      error: "Failed to check bucket accessibility"
    }, { status: 500 })
  }
} 