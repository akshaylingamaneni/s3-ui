import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import redis from '@/lib/redis'

export async function DELETE(req: Request) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { profileName } = await req.json()
    
    const currentCredentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []
    
    const updatedCredentials = currentCredentials.filter(cred => 
      cred.profileName !== profileName
    )

    // Update credentials in Redis
    await redis.set(`aws_credentials:${user.id}`, updatedCredentials)

    // Clean up all buckets associated with this profile
    const bucketKeys = await redis.hkeys(`user:${user.id}:buckets`)
    
    // Get all bucket data to check which ones belong to this profile
    const bucketsData = await Promise.all(
      bucketKeys.map(async key => ({
        key,
        data: await redis.hget(`user:${user.id}:buckets`, key)
      }))
    )

    // Delete buckets associated with this profile
    const bucketsToDelete = bucketsData
      .filter(bucket => (bucket.data as any).profileName === profileName)
      .map(bucket => bucket.key)

    if (bucketsToDelete.length > 0) {
      await redis.hdel(`user:${user.id}:buckets`, ...bucketsToDelete)
    }

    return NextResponse.json({ 
      success: true,
      deletedBuckets: bucketsToDelete.length
    })
  } catch (error) {
    console.error("Delete Profile Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete profile"
    }, { status: 500 })
  }
} 