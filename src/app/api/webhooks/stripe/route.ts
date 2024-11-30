/******************************************************************************
                                IMPORTS
******************************************************************************/
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'

/******************************************************************************
                                TYPES
******************************************************************************/
interface StripeEvent {
  type: string
  data: {
    object: any
  }
}

/******************************************************************************
                            HELPER FUNCTIONS
******************************************************************************/
const verifyStripeSignature = async (req: Request, signature: string) => {
  const body = await req.text()
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ) as StripeEvent
  } catch (error: any) {
    throw new Error(`Webhook Error: ${error.message}`)
  }
}

const handleCheckoutComplete = async (session: any) => {
  const { courseId, userId } = session.metadata
  await prisma.purchase.create({
    data: { courseId, userId }
  })
}

/******************************************************************************
                              API HANDLER
******************************************************************************/
export async function POST(req: Request) {
  try {
    const signature = headers().get('Stripe-Signature')
    if (!signature) {
      return new NextResponse('No signature', { status: 400 })
    }

    const event = await verifyStripeSignature(req, signature)

    if (event.type === 'checkout.session.completed') {
      await handleCheckoutComplete(event.data.object)
    }

    return new NextResponse(null, { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new NextResponse(error.message, { status: 400 })
  }
} 