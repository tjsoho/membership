// src/app/api/external/create-checkout/route.ts
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Add these types at the top
interface StripeError {
  type: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

// Standard error interface
interface StandardError extends Error {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.savetime-makemoney.com',
  // add any other domains that need access
];

// CORS headers helper
const corsHeaders = (origin: string | null): HeadersInit => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin || '*' : allowedOrigins[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
})

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin')
  console.log('🔍 OPTIONS request received from:', origin)
  
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin)
  })
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin')
  console.log('🚀 POST request received from:', origin)
  console.log('🔍 Request headers:', Object.fromEntries(req.headers))
  
  try {
    // Validate request body
    const body = await req.json()
    console.log('📦 Request body:', body)
    
    const { courseId, email, source } = body
    
    if (!courseId || !email) {
      console.error('❌ Missing required fields:', { courseId, email })
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }), 
        { 
          status: 400,
          headers: corsHeaders(origin)
        }
      )
    }

    // Get course details
    console.log('🔍 Finding course:', courseId)
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })
    console.log('📦 Course details:', course)

    if (!course) {
      console.error('❌ Course not found:', courseId)
      return new NextResponse(
        JSON.stringify({ message: 'Course not found' }), 
        { 
          status: 404,
          headers: corsHeaders(origin)
        }
      )
    }

    // Set up URLs
    const isProduction = process.env.NODE_ENV === 'production'
    console.log('🔍 Environment:', { 
      isProduction, 
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      LANDING_PAGE_URL: process.env.LANDING_PAGE_URL
    })

    const cancelUrl = isProduction
      ? `${process.env.LANDING_PAGE_URL || 'https://www.savetime-makemoney.com'}/cancel`
      : 'http://localhost:3000/cancel'

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`

    console.log('🔍 URLs:', { cancelUrl, successUrl })

    // Create Stripe session
    console.log('💳 Creating Stripe session')
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
      success_url: 'https://www.savvybusinesshub.com',
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        courseId,
        email,
        source: 'EXTERNAL'
      }
    })

    console.log('✅ Stripe session created:', {
      sessionId: session.id,
      url: session.url
    })

    return new NextResponse(
      JSON.stringify({ sessionId: session.id }), 
      { 
        status: 200,
        headers: corsHeaders(origin)
      }
    )
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ 
        message: 'Failed to create checkout session',
        error: err instanceof Error ? err.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: corsHeaders(origin)
      }
    )
  }
}