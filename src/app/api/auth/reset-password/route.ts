import { prisma } from "../../../../lib/db/prisma"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log('🔑 Password reset request received')
  
  try {
    const { token, password } = await req.json()
    console.log('🔍 Validating reset token')

    if (!token || !password) {
      console.log('⚠️ Missing token or password')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken) {
      console.log('⚠️ Invalid reset token')
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    if (resetToken.expires < new Date()) {
      console.log('⚠️ Expired reset token')
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    console.log('🔒 Hashing new password')
    // Hash the new password
    const hashedPassword = await hash(password, 10)

    console.log('📝 Updating user password')
    // Update user's password
    const user = await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    })

    console.log('🗑️ Cleaning up used reset token')
    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    console.log('✅ Password reset successful')
    return NextResponse.json({ 
      success: true,
      email: user.email // Return email for auto-login
    })

  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 