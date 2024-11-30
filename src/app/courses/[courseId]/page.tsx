import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { ClientWrapper } from './ClientWrapper'

async function hasAccess(userId: string, courseId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      courseId,
    },
  })
  return !!purchase
}

export default async function CoursePage({ 
  params,
  searchParams 
}: { 
  params: { courseId: string }
  searchParams: { payment_intent?: string }
}) {
  // Get the session
  const session = await getAuthSession()
  if (!session?.user) {
    redirect('/login')
  }

  // Get the course
  const course = await prisma.course.findUnique({
    where: { id: params.courseId }
  })

  if (!course) {
    redirect('/courses')
  }

  // Check if user has access
  const hasUserAccess = await hasAccess(session.user.id, params.courseId)

  return (
    <ClientWrapper
      course={course}
      hasAccess={hasUserAccess}
      userId={session.user.id}
      paymentIntent={searchParams.payment_intent}
    />
  )
}