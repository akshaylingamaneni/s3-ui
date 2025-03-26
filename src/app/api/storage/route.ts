import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import redis from '@/lib/redis'


export async function GET(request: Request) {
  const { userId } = await auth()
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor') || ''
  const limit = Number(searchParams.get('limit')) || 20
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const bucketKeys = await redis.hkeys(`user:${userId}:buckets`)
    const startIndex = cursor ? bucketKeys.indexOf(cursor) + 1 : 0
    const pageKeys = bucketKeys.slice(startIndex, startIndex + limit)
    const buckets = await Promise.all(
      pageKeys.map(async (key) => {
        const data = await redis.hget(`user:${userId}:buckets`, key)
       return data 
      })
    )

    const preferences = await redis.get(`user:${userId}:preferences`)

    return NextResponse.json({
      buckets,
      preferences: preferences ? JSON.parse(preferences as string) : null,
      nextCursor: pageKeys.length === limit ? pageKeys[pageKeys.length - 1] : undefined
    })
  } catch (error) {
    console.error('Storage error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { type, data } = await request.json()

    switch (type) {
      case 'bucket': {
        // Add bucket to Redis
        await redis.hset(`user:${userId}:buckets`, {
          [data.id]: JSON.stringify({
            ...data,
            updatedAt: Date.now()
          })
        })
        break
      }
      default:
        return new NextResponse('Invalid type', { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Storage error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const bucketId = searchParams.get('bucketId')

    if (!bucketId) {
      return new NextResponse('Bucket ID required', { status: 400 })
    }

    await redis.hdel(`user:${userId}:buckets`, bucketId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Storage error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 