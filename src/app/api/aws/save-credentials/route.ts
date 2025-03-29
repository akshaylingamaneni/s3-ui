import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { encrypt } from '@/lib/encryption'
import redis from '@/lib/redis'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { credentials } = await req.json()
    
    // Encrypt sensitive data
    const encryptedCredentials = {
      ...credentials,
      secretAccessKey: credentials.secretAccessKey ? 
        await encrypt(credentials.secretAccessKey) : 
        undefined
    }

    // Get existing credentials from Redis
    const existingCredentials = await redis.get<any[]>(`aws_credentials:${user.id}`) || []

    // Update or add new profile
    const updatedCredentials = existingCredentials.some(
      cred => cred.profileName === credentials.profileName
    ) 
      ? existingCredentials.map(cred => 
          cred.profileName === credentials.profileName 
            ? encryptedCredentials 
            : cred
        )
      : [...existingCredentials, encryptedCredentials]

    // Save to Redis
    await redis.set(`aws_credentials:${user.id}`, updatedCredentials)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("AWS Save Credentials Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to save credentials" 
    })
  }
} 