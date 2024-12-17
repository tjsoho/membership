// src/app/api/external/create-checkout/route.ts
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(req: Request) {
  const origin = headers().get('origin')
  
  try {
    const { courseId, email, source } = await req.json()
    console.log('Received request:', { courseId, email, source }) // Debug log

    // 1. Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return new NextResponse(
        JSON.stringify({ message: 'Course not found' }), 
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // 2. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: course.title,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.LANDING_PAGE_URL}/cancel`,
      customer_email: email,
      metadata: {
        courseId,
        email,
        source: 'EXTERNAL'
      }
    })

    return new NextResponse(
      JSON.stringify({ checkoutUrl: session.url }), 
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create checkout session' }), 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Content-Type': 'application/json',
        }
      }
    )
  }
}