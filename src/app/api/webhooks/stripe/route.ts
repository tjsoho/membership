/******************************************************************************
                                IMPORTS
******************************************************************************/
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

/******************************************************************************
                              WEBHOOK HANDLER
******************************************************************************/
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

        // Send receipt email
        try {
          // Send receipt to customer
          await sgMail.send({
            to: paymentIntent.metadata.email,
            from: 'your-verified-sender@yourdomain.com',
            subject: `Receipt for ${paymentIntent.metadata.courseTitle}`,
            html: `
              <h1>Thank you for your purchase!</h1>
              <p>Course: ${paymentIntent.metadata.courseTitle}</p>
              <p>Amount: $${paymentIntent.amount / 100}</p>
              <br/>
              <p>If you haven't done so already, please create your account using the email address you purchased the Masterclass with. You can do this by clicking the link below:</p>
              <br/>
              <a href="https://www.savvybusinesshub.com/">The Savvy Business Hub</a>
              <p>Business Details: Ai Guy Business Solutions</p>
              <p>Gold Coast, QLD, Australia</p>
              <p>toby@ai-guy.co</p>
              <p>ABN: 21 675 514 351 </p>
            `
          });

          // Send notification to admin
          await sgMail.send({
            to: process.env.ADMIN_EMAIL!, // Add this to your .env file
            from: 'your-verified-sender@yourdomain.com',
            subject: `New Course Purchase: ${paymentIntent.metadata.courseTitle}`,
            html: `
              <h1>New Course Purchase!</h1>
              <p>Course: ${paymentIntent.metadata.courseTitle}</p>
              <p>Amount: $${paymentIntent.amount / 100}</p>
              <p>Customer Email: ${paymentIntent.metadata.email}</p>
              <p>Purchase Time: ${new Date().toLocaleString()}</p>
            `
          });

          console.log('📧 Sent receipt email to customer and notification to admin');
        } catch (error) {
          console.error('Failed to send emails:', error);
        }
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