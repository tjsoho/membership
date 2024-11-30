/******************************************************************************
                                IMPORTS
******************************************************************************/
import { getAuthSession } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

/******************************************************************************
                              API HANDLER
******************************************************************************/
export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { courseId, price } = body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        courseId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment intent error:', error)
    return new NextResponse('Error creating payment intent', { status: 500 })
  }
} 