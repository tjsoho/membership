import { prisma } from "../../../../lib/db/prisma"
import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { sendPasswordResetEmail } from "../../../../lib/email"

export async function POST(req: Request) {
  console.log('📧 Forgot password request received')
  
  try {
    const { email } = await req.json()
    console.log('📧 Processing reset for email:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('⚠️ User not found for email:', email)
      // Still return success to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    console.log('✅ User found, generating reset token')
    // Generate reset token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    console.log('🔑 Creating password reset token')
    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      }
    })

    console.log('📨 Sending reset email')
    // Send reset email
    await sendPasswordResetEmail(email, token)
    console.log('✉️ Reset email sent successfully')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    )
  }
}