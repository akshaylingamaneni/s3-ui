import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const awsCredentials = user.privateMetadata.awsCredentials || []
    console.log("awsCredentials", awsCredentials)
    // Return profiles without sensitive data
    const profiles = Array.isArray(awsCredentials) ? awsCredentials.map(cred => ({
      profileName: cred.profileName,
      accessKeyId: cred.accessKeyId,
      // Don't send secret key to client
    })) : []
    console.log("profiles", profiles)
    return NextResponse.json({ 
      success: true,
      profiles
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch profiles"
    }, { status: 500 })
  }
} 