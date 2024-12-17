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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💳 Checkout session completed:', {
        sessionId: session.id,
        metadata: session.metadata
      })

      // Create purchase record for external purchases
      if (session.metadata?.source === 'EXTERNAL') {
        console.log('📦 Creating purchase record for external purchase')
        
        // Create a temporary user for external purchases
        const tempUser = await prisma.user.create({
          data: {
            email: session.metadata.email,
            name: 'Pending Registration',
            password: 'TEMPORARY_' + Math.random().toString(36).slice(2), // Random temporary password
            emailVerified: null,
            image: null
          }
        })

        await prisma.purchase.create({
          data: {
            userId: tempUser.id,
            courseId: session.metadata.courseId,
            paymentIntentId: session.payment_intent as string,
            purchaseSource: 'EXTERNAL'
          }
        })

        // Also create course access for the user
        await prisma.courseAccess.create({
          data: {
            userId: tempUser.id,
            courseId: session.metadata.courseId,
            active: true
          }
        })

        console.log('✅ Purchase record and course access created with temporary user')
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('💥 Webhook error:', err)
    return new NextResponse(
      JSON.stringify({ message: 'Webhook error' }), 
      { status: 400 }
    )
  }
}

/******************************************************************************
                              HELPER FUNCTIONS
******************************************************************************/
async function handleSuccessfulPayment(session: Stripe.PaymentIntent) {
  console.log('💰 Processing successful payment:', session.id)
  
  const { courseId, userId, source = 'INTERNAL' } = session.metadata as { 
    courseId: string; 
    userId: string;
    source?: 'INTERNAL' | 'EXTERNAL';
  }
  
  await prisma.purchase.create({
    data: {
      paymentIntentId: session.id,
      purchaseSource: source,
      courseId,
      userId
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