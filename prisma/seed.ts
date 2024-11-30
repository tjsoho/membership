const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is not set')
}

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      isAdmin: true
    },
    create: {
      email: process.env.ADMIN_EMAIL,
      name: 'Toby Carroll',
      password: hashedPassword,
      isAdmin: true
    }
  })

  console.log('Admin user created/updated:', adminUser)

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: 'perfect-homepage' },
    update: {},
    create: {
      id: 'perfect-homepage',
      title: 'The Perfect Home Page',
      description: 'Learn how to create a high-converting homepage that drives results',
      image: '/courses/perfect-homepage.jpg',
      price: 32,
      stripeProductId: 'prod_RJLWre66OD7X49'
    }
  })

  console.log({ adminUser, course })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })