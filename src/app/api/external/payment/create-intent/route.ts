import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// CORS headers helper (reuse from your other endpoint)
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.savetime-makemoney.com',
];

const corsHeaders = (origin: string | null): HeadersInit => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin || '*' : allowedOrigins[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
})

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin)
  })
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin')
  
  try {
    const body = await req.json()
    const { courseId, email, amount, currency } = body

    // Validate inputs
    if (!courseId || !email || !amount) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }), 
        { 
          status: 400,
          headers: corsHeaders(origin)
        }
      )
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return new NextResponse(
        JSON.stringify({ message: 'Course not found' }), 
        { 
          status: 404,
          headers: corsHeaders(origin)
        }
      )
    }

    // Create payment intent with product details
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'aud',
      metadata: {
        courseId,
        email,
        source: 'EXTERNAL'
      },
      description: `Purchase of ${course.title}`,
      statement_descriptor: 'Course Purchase',
      statement_descriptor_suffix: course.title.substring(0, 22), // Stripe limit
    })

    return new NextResponse(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        course: {
          title: course.title,
          price: course.price
        }
      }), 
      {
        status: 200,
        headers: corsHeaders(origin)
      }
    )
  } catch (err) {
    console.error('Payment intent creation error:', err)
    return new NextResponse(
      JSON.stringify({ 
        message: 'Failed to create payment intent',
        error: err instanceof Error ? err.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: corsHeaders(origin)
      }
    )
  }
} 