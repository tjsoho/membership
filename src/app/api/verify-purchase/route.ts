import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { prisma } from '../../../lib/db/prisma'
import { getAuthSession } from '../../../lib/auth'

export async function POST(request: Request) {
  console.log('=== API ROUTE STARTED ===')
  
  try {
    // 1. Get session
    const session = await getAuthSession()
    console.log('Session:', {
      exists: !!session,
      userId: session?.user?.id
    })

    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        details: 'No session found'
      }, { status: 401 })
    }

    // 2. Get and validate request data
    const body = await request.json()
    console.log('Request body:', body)

    const { paymentIntentId, courseId } = body
    if (!paymentIntentId || !courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bad Request',
        details: 'Missing paymentIntentId or courseId'
      }, { status: 400 })
    }

    // 3. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found',
        details: 'User does not exist in database'
      }, { status: 404 })
    }

    // 4. Verify payment intent
    console.log('Fetching payment intent:', paymentIntentId)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    console.log('Payment intent status:', paymentIntent.status)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not succeeded',
        details: `Status is ${paymentIntent.status}`
      })
    }

    // 5. Check for existing purchase
    const existingPurchase = await prisma.purchase.findFirst({
      where: { paymentIntentId }
    })
    console.log('Existing purchase:', existingPurchase)

    if (existingPurchase) {
      return NextResponse.json({ 
        success: true,
        details: 'Purchase already exists'
      })
    }

    // 6. Create purchase
    console.log('Creating purchase:', {
      paymentIntentId,
      userId: user.id,
      courseId
    })

    const purchase = await prisma.purchase.create({
      data: {
        paymentIntentId,
        userId: user.id,
        courseId,
      }
    })

    console.log('Purchase created:', purchase)
    return NextResponse.json({ 
      success: true,
      details: 'Purchase created successfully'
    })

  } catch (error: any) {
    console.error('=== API ROUTE ERROR ===')
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    })

    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error?.message
    }, { status: 500 })
  }
} 