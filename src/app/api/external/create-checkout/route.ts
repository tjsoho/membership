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
    console.log('Found course:', course) // Debug log

    if (!course) {
      console.log('Course not found for ID:', courseId) // Debug log
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
    console.log('Creating Stripe session for course:', course.title) // Debug log
    const isProduction = process.env.NODE_ENV === 'production';
    const cancelUrl = isProduction
      ? `${process.env.LANDING_PAGE_URL || 'https://www.savetime-makemoney.com/'}/cancel`
      : 'http://localhost:3000/cancel';

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`;

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
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        courseId,
        email,
        source: 'EXTERNAL'
      }
    })
    console.log('Stripe session created:', session.id) // Debug log

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
    // More detailed error logging
    console.error('Checkout error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return new NextResponse(
      JSON.stringify({ 
        message: 'Failed to create checkout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 
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