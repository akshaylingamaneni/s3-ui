import redis from "@/lib/redis"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || ''
    const limit = Number(searchParams.get('limit')) || 20
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const startTime = Date.now()
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
      const endTime = Date.now()
      const duration = endTime - startTime
      console.log(`Redis operation took ${duration}ms`)
      return NextResponse.json({
        buckets,
        nextCursor: pageKeys.length === limit ? pageKeys[pageKeys.length - 1] : undefined
      })
    } catch (error) {
      console.error('Storage error:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }
