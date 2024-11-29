import { prisma } from '@/lib/db/prisma'
import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CoursesGrid } from '@/components/CoursesGrid'

// Define the type for the course from Prisma query
interface CourseWithPurchases {
  id: string
  title: string
  description: string
  image: string
  price: number
  purchases: {
    userId: string
  }[]
}

// Define the type for the transformed course
interface CourseWithUnlockStatus {
  id: string
  title: string
  description: string
  image: string
  price: number
  isUnlocked: boolean
}

export default async function DashboardPage() {
  const session = await getAuthSession()
  if (!session) {
    redirect('/login')
  }

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      price: true,
      purchases: {
        where: {
          userId: session.user.id
        }
      }
    }
  }) as CourseWithPurchases[]

  const coursesWithPurchaseStatus: CourseWithUnlockStatus[] = courses.map((course) => ({
    ...course,
    isUnlocked: course.purchases.length > 0
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Courses</h1>
      <CoursesGrid courses={coursesWithPurchaseStatus} />
    </div>
  )
}