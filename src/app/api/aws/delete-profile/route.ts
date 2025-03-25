import { NextResponse } from 'next/server'
import { currentUser, clerkClient } from '@clerk/nextjs/server'

export async function DELETE(req: Request) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { profileName } = await req.json()
    
    const currentCredentials = user.privateMetadata.awsCredentials || []
    const updatedCredentials = Array.isArray(currentCredentials) 
      ? currentCredentials.filter(cred => cred.profileName !== profileName)
      : []

    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(user.id, {
      privateMetadata: {
        awsCredentials: updatedCredentials,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to delete profile"
    }, { status: 500 })
  }
} 