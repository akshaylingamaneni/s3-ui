import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { decrypt } from '@/lib/encryption'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { encryptedKey } = await req.json()
    const decryptedKey = await decrypt(encryptedKey)

    return NextResponse.json({ 
      success: true,
      decryptedKey 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to decrypt key"
    }, { status: 500 })
  }
} 