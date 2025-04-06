import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'
import redis from '@/lib/redis'
import { decrypt } from '@/lib/encryption'
import { createS3Client } from '@/lib/aws/s3-client'

export async function POST(req: Request) {
    try {
        const user = await currentUser()
        if (!user || !user.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { profileName } = await req.json()

        const credentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []
        const profile = credentials.find(cred => cred.profileName === profileName)

        if (!profile) {
            return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
        }

        const secretAccessKey = await decrypt(profile.secretAccessKey)

        const client = createS3Client({
            ...profile,
            secretAccessKey
        })

        // Get all buckets
        
        const command = new ListBucketsCommand({})
        const response = await client.send(command)
        console.log('response', response)
        const buckets = response.Buckets || []

        // Prepare buckets for sorted set
        const bucketEntries = buckets.map(bucket => ({
            name: bucket.Name,
            creationDate: bucket.CreationDate,
            profileName: profile.profileName,
            bucketType: 'private',
            updatedAt: Date.now()
        })).sort((a, b) => a.name?.localeCompare(b.name || '') || 0) // Sort alphabetically

        // Handle additions and deletions
        if (bucketEntries.length > 0) {
            const existingBuckets = await redis.zrange(`profile:${profileName}:${user.id}:buckets`, 0, -1)
            const existingMap = new Map(
                existingBuckets.map(bucket => {
                    // @ts-ignore
                    return [bucket.name, bucket]
                })
            )
            console.log('existingMap', existingMap)
            // Find new buckets to add
            const deltaBuckets = bucketEntries.filter(bucket => !existingMap.has(bucket.name))

            // Find buckets to delete (exist in Redis but not in S3)
            if (deltaBuckets.length > 0) {
                const currentBucketNames = new Set(bucketEntries.map(b => b.name))
                const bucketsToDelete = Array.from(existingMap.entries())
                    .filter(([name]) => !currentBucketNames.has(name))
                    .map(([, value]) => value)
                // Add new buckets
                for (const bucket of deltaBuckets) {
                    await redis.zadd(
                        `profile:${profileName}:${user.id}:buckets`,
                        { nx: true },
                        {
                            score: bucket.name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0,
                            member: JSON.stringify(bucket)
                        }
                    )
                }

                // Remove deleted buckets
                if (bucketsToDelete.length > 0) {
                    await redis.zrem(`profile:${profileName}:${user.id}:buckets`, bucketsToDelete)
                }
                console.log('bucketsToDelete', bucketsToDelete)

                // Update metadata with deletion info
                await redis.set(`profile:${profileName}:${user.id}:metadata`, {
                    lastImported: Date.now(),
                    totalBuckets: buckets.length,
                    region: profile.region,
                    addedBuckets: deltaBuckets.length,
                    deletedBuckets: bucketsToDelete.length
                })
            }
        }

        return NextResponse.json({
            success: true,
            totalBuckets: buckets.length
        })

    } catch (error) {
        console.error('Import Buckets Error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to import buckets"
        }, { status: 500 })
    }
} 