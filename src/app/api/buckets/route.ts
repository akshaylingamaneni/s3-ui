import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { profile, cursor = 0, limit = 50 } = await request.json()
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile name is required' },
        { status: 400 }
      )
    }
    const start = Number(cursor) || 0
    const end = start + (Number(limit) || 50) - 1

    const buckets = await redis.zrange(
      `profile:${profile}:${user.id}:buckets`,
      start,
      end
    )
    const totalBuckets = await redis.zcard(`profile:${profile}:${user.id}:buckets`)
    return NextResponse.json({
      buckets,
      success: true,
      pagination: {
        hasMore: start + limit < totalBuckets,
        total: totalBuckets,
        nextCursor: start + limit
      }
    })
  } catch (error) {
    console.error('Error listing buckets:', error)
    return NextResponse.json(
      { error: 'Failed to list buckets' },
      { status: 500 }
    )
  }
}
