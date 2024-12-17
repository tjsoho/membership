// src/app/api/external/create-checkout/route.ts
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  try {
    const { courseId, email, source } = await req.json()

    // 1. Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return new Response('Course not found', { status: 404 })
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
      customer_email: email, // Pre-fill email
      metadata: {
        courseId,
        email,
        source: 'EXTERNAL'
      }
    })

    return new Response(JSON.stringify({ checkoutUrl: session.url }))
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return new Response('Failed to create checkout session', { status: 500 })
  }
}