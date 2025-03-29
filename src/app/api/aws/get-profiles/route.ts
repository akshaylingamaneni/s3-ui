import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import redis from '@/lib/redis'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const awsCredentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []
    console.log("awsCredentials", awsCredentials)
    // Return profiles without sensitive data
    const profiles = awsCredentials.map(cred => ({
      profileName: cred.profileName,
      accessKeyId: cred.accessKeyId,
      secretAccessKey: cred.secretAccessKey,
      region: cred.region,
      endpoint: cred.endpoint,
      forcePathStyle: cred.forcePathStyle,
    }))

    return NextResponse.json({ 
      success: true,
      profiles
    })
  } catch (error) {
    console.error("Get Profiles Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch profiles"
    }, { status: 500 })
  }
} 