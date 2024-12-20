import { stripe } from '@/lib/stripe'
// import { prisma } from '@/lib/db/prisma'
// import { headers } from 'next/headers'
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
    const { courseId, email, amount, currency, source } = await req.json()

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        source: 'EXTERNAL',
        courseId,
        email
      }
    })

    console.log('✅ Created payment intent with metadata:', {
      id: paymentIntent.id,
      metadata: paymentIntent.metadata
    })

    return new NextResponse(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret 
      }), 
      {
        status: 200,
        headers: corsHeaders(origin)
      }
    )
  } catch (err) {
    console.error('💥 Error:', err)
    return new NextResponse(
      JSON.stringify({ 
        message: 'Failed to create payment intent',
        error: err instanceof Error ? err.message : 'Unknown error'
      }), 
      { status: 500, headers: corsHeaders(origin) }
    )
  }
} 