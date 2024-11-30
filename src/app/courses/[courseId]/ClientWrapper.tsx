'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { PurchaseModal } from '@/components/PurchaseModal'
import { MarketingCourseContent } from '@/components/courses/MarketingCourseContent'

interface ClientWrapperProps {
  course: any
  hasAccess: boolean
  userId: string
  paymentIntent?: string | null
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

  return <MarketingCourseContent />
} 