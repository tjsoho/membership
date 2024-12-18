/******************************************************************************
                                IMPORTS
******************************************************************************/
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

/******************************************************************************
                              WEBHOOK HANDLER
******************************************************************************/
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') as string
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    console.log('🎉 Webhook event received:', event.type)

    // Handle checkout.session.completed (for redirect flow)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💳 Checkout session completed:', {
        sessionId: session.id,
        metadata: session.metadata
      })

      if (session.metadata?.source === 'EXTERNAL') {
        await handleExternalPurchase(
          session.metadata.email,
          session.metadata.courseId,
          session.payment_intent as string
        )
      }
    }

    // Handle payment_intent.succeeded (for modal flow)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('💰 Payment intent succeeded:', {
        id: paymentIntent.id,
        metadata: paymentIntent.metadata
      })

      if (paymentIntent.metadata?.source === 'EXTERNAL') {
        await handleExternalPurchase(
          paymentIntent.metadata.email,
          paymentIntent.metadata.courseId,
          paymentIntent.id
        )
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('💥 Webhook error:', err)
    return new NextResponse(
      JSON.stringify({ 
        message: 'Webhook error',
        error: err instanceof Error ? err.message : 'Unknown error'
      }), 
      { status: 400 }
    )
  }
}

/******************************************************************************
                              HELPER FUNCTIONS
******************************************************************************/
async function handleExternalPurchase(email: string, courseId: string, paymentIntentId: string) {
  console.log('📦 Creating purchase record for external purchase', {
    email,
    courseId,
    paymentIntentId
  })

  try {
    // Create temporary user
    const tempUser = await prisma.user.create({
      data: {
        email,
        name: 'Pending Registration',
        password: 'TEMPORARY_' + Math.random().toString(36).slice(2),
        emailVerified: null,
        image: null
      }
    })
    console.log('👤 Created temp user:', tempUser.id)

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: tempUser.id,
        courseId,
        paymentIntentId,
        purchaseSource: 'EXTERNAL'
      }
    })
    console.log('💰 Created purchase:', purchase.id)

    // Create course access
    const access = await prisma.courseAccess.create({
      data: {
        userId: tempUser.id,
        courseId,
        active: true
      }
    })
    console.log('🔑 Created course access:', access.id)

    return { tempUser, purchase, access }
  } catch (error) {
    console.error('❌ Error in handleExternalPurchase:', error)
    throw error
  }
} 