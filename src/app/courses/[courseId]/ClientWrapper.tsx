'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { PurchaseModal } from '@/components/PurchaseModal'
import { MarketingCourseContent } from '@/components/courses/MarketingCourseContent'
import { ThePerfectHomePage } from '@/components/courses/ThePerfectHomePage'
import { AmazingTest } from '@/components/courses/AmazingTest'

interface ClientWrapperProps {
  course: any
  hasAccess: boolean
  userId: string
  paymentIntent?: string | null
}

const courseComponents = {
  'marketing-course': MarketingCourseContent,
  'the-perfect-home-page': ThePerfectHomePage,
  'amazing-test': AmazingTest
}

export function ClientWrapper({ course, hasAccess, userId, paymentIntent }: ClientWrapperProps) {
  const router = useRouter()

  useEffect(() => {
    async function verifyPurchase() {
      if (paymentIntent) {
        console.log('Starting verification:', {
          paymentIntent,
          courseId: course.id,
          userId,
          hasAccess
        })

        try {
          const response = await fetch('/api/verify-purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent,
              courseId: course.id
            })
          })

          const data = await response.json()
          console.log('Verification response:', data)

          if (data.success) {
            toast.success('Payment successful! Welcome to the course!')
            router.refresh()
          } else {
            toast.error(`Verification failed: ${data.details || data.error}`)
            console.error('Verification failed:', {
              error: data.error,
              details: data.details
            })
          }
        } catch (error) {
          console.error('Verification error:', error)
          toast.error('An error occurred. Please contact support.')
        }
      }
    }

    verifyPurchase()
  }, [paymentIntent, course.id, userId, router, hasAccess])

  if (!hasAccess) {
    return <PurchaseModal course={course} />
  }

  const CourseComponent = courseComponents[course.id as keyof typeof courseComponents]

  if (!CourseComponent) {
    return (
      <div className="min-h-screen bg-coastal-shell py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-xl font-bold mb-4">Course Not Found</h1>
            <p>This course content is not available.</p>
          </div>
        </div>
      </div>
    )
  }

  return <CourseComponent />
} 