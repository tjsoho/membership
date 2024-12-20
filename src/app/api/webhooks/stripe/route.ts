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
    console.log('🎯 Receiving webhook...')
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    console.log('🎉 Event type:', event.type)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('💰 Payment succeeded:', {
        id: paymentIntent.id,
        metadata: paymentIntent.metadata
      })

      if (paymentIntent.metadata?.source === 'EXTERNAL') {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email: paymentIntent.metadata.email }
        })

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              email: paymentIntent.metadata.email,
              name: 'Pending Registration',
              password: `TEMP_${Math.random().toString(36).slice(2)}_${Date.now()}`,
              emailVerified: null,
              image: null
            }
          })
          console.log('👤 Created new user:', user.id)
        } else {
          console.log('👤 Found existing user:', user.id)
        }

        // Create purchase record
        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            courseId: paymentIntent.metadata.courseId,
            paymentIntentId: paymentIntent.id,
            purchaseSource: 'EXTERNAL'
          }
        })
        console.log('💰 Created purchase:', purchase.id)

        // Find existing access
        const existingAccess = await prisma.courseAccess.findFirst({
          where: {
            userId: user.id,
            courseId: paymentIntent.metadata.courseId
          }
        })

        if (existingAccess) {
          // Update existing access
          await prisma.courseAccess.update({
            where: { id: existingAccess.id },
            data: { active: true }
          })
          console.log('🔄 Updated course access:', existingAccess.id)
        } else {
          // Create new access
          const access = await prisma.courseAccess.create({
            data: {
              userId: user.id,
              courseId: paymentIntent.metadata.courseId,
              active: true
            }
          })
          console.log('🔑 Created course access:', access.id)
        }

        // TODO: Send welcome email with login instructions
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('💥 Webhook error:', err)
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', err)
    }
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