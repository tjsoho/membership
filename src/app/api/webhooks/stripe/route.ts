/******************************************************************************
                                IMPORTS
******************************************************************************/
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'

/******************************************************************************
                              WEBHOOK HANDLER
******************************************************************************/
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      await handleSuccessfulPayment(event.data.object as Stripe.PaymentIntent)
    }
    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('❌ Webhook handler failed:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
}

/******************************************************************************
                              HELPER FUNCTIONS
******************************************************************************/
async function handleSuccessfulPayment(session: Stripe.PaymentIntent) {
  console.log('💰 Processing successful payment:', session.id)
  
  const { courseId, userId } = session.metadata as { courseId: string; userId: string }
  
  await prisma.purchase.create({
    data: {
      paymentIntentId: session.id,
      course: {
        connect: { id: courseId }
      },
      user: {
        connect: { id: userId }
      }
    }
  })

  // Also create course access
  await prisma.courseAccess.create({
    data: {
      courseId,
      userId,
      active: true
    }
  })

  console.log('✅ Purchase and access records created successfully')
} 