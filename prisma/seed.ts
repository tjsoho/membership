import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.purchase.deleteMany()
  await prisma.course.deleteMany()

  // Create courses with your existing images
  await prisma.course.createMany({
    data: [
      {
        title: 'Getting Started with Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript',
        image: '/images/3.png', // Using your existing image
        price: 49.99,
      },
      {
        title: 'Advanced React Patterns',
        description: 'Master React with advanced patterns and best practices',
        image: '/images/4.png', // Using your existing image
        price: 79.99,
      },
      {
        title: 'Full Stack Development',
        description: 'Build complete applications with Next.js and Prisma',
        image: '/images/6.png', // Using your existing image
        price: 99.99,
      },
    ],
  })

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })