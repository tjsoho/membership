import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'toby@ai-guy.co' // The email to make admin

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })

    console.log('✅ Successfully updated user to admin:', updatedUser.email)
  } catch (error) {
    console.error('Failed to update user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 