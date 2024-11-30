'use server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'

export async function verifyAndRecordPurchase(paymentIntentId: string, userId: string, courseId: string) {
  console.log('=== SERVER ACTION STARTED ===')
  console.log('Inputs:', { paymentIntentId, userId, courseId })

  // 1. Test Stripe connection
  try {
    const testStripe = await stripe.paymentIntents.list({ limit: 1 })
    console.log('Stripe connection test:', !!testStripe)
  } catch (stripeError) {
    console.error('Stripe connection failed:', stripeError)
    return false
  }

  // 2. Get payment intent
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    console.log('Payment Intent:', {
      id: paymentIntent.id,
      status: paymentIntent.status
    })
  } catch (error) {
    console.error('Failed to get payment intent:', error)
    return false
  }

  // 3. Test database connection
  try {
    const testUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    console.log('Database connection test:', !!testUser)
  } catch (dbError) {
    console.error('Database connection failed:', dbError)
    return false
  }

  // 4. Create purchase
  try {
    const purchase = await prisma.purchase.create({
      data: {
        paymentIntentId,
        userId,
        courseId
      }
    })
    console.log('Purchase created:', purchase)
    return true
  } catch (createError) {
    console.error('Failed to create purchase:', createError)
    return false
  }
}