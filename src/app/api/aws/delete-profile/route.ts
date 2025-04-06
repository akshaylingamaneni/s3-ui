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

    await redis.set(`aws_credentials:${user.id}`, updatedCredentials)

    const deletedBuckets = await redis.del(`profile:${profileName}:${user.id}:buckets`)
    const deletedMetadata = await redis.del(`profile:${profileName}:${user.id}:metadata`)

    return NextResponse.json({
      success: true,
      deletedBuckets: deletedBuckets === 1,
      deletedMetadata: deletedMetadata === 1
    })
  } catch (error) {
    console.error("Delete Profile Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete profile"
    }, { status: 500 })
  }
} 