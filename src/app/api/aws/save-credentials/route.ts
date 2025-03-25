import { NextResponse } from 'next/server'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { encrypt } from '@/lib/encryption'

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

    // Get existing credentials array
    const existingCredentials = (user.privateMetadata.awsCredentials as any[] || [])

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

    // Save the updated array back to Clerk
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(user.id, {
      privateMetadata: {
        awsCredentials: updatedCredentials,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("AWS Save Credentials Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to save credentials" 
    })
  }
} 