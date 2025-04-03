import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import redis from '@/lib/redis'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const credentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []
    
    // Return profiles without decrypting secretAccessKey
    const profiles = credentials.map(cred => ({
      profileName: cred.profileName,
      accessKeyId: cred.accessKeyId,
      secretAccessKey: cred.secretAccessKey, // Keep encrypted
      endpoint: cred.endpoint,
      region: cred.region,
      forcePathStyle: cred.forcePathStyle
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