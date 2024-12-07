import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add connection handling
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((e) => {
    console.error('Failed to connect to database:', e)
  })

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
