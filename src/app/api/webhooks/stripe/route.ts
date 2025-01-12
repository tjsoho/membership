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

// Add type for transaction return data
type TransactionResult = {
  user: any;
  course: { title: string } | null;
  paymentIntent: Stripe.PaymentIntent;
}

// New email service
const emailService = {
  async sendReceiptEmail(data: { email: string, courseTitle: string, amount: number }) {
    await sgMail.send({
      to: data.email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `Receipt for ${data.courseTitle}`,
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Course: ${data.courseTitle}</p>
        <p>Amount: $${data.amount}</p>
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
  },

  async sendAdminNotification(data: { courseTitle: string, amount: number, customerEmail: string }) {
    await sgMail.send({
      to: process.env.ADMIN_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `New Course Purchase: ${data.courseTitle}`,
      html: `
        <h1>New Course Purchase!</h1>
        <p>Course: ${data.courseTitle}</p>
        <p>Amount: $${data.amount}</p>
        <p>Customer Email: ${data.customerEmail}</p>
        <p>Purchase Time: ${new Date().toLocaleString()}</p>
      `
    });
  }
};

// Handler for external purchases
async function handleExternalPurchaseEvent(paymentIntent: Stripe.PaymentIntent) {
  return await prisma.$transaction(async (tx) => {
    // Check if user exists
    let user = await tx.user.findUnique({
      where: { email: paymentIntent.metadata.email }
    });

    if (!user) {
      user = await tx.user.create({
        data: {
          email: paymentIntent.metadata.email,
          name: 'Pending Registration',
          password: `TEMP_${Math.random().toString(36).slice(2)}_${Date.now()}`,
          emailVerified: null,
          image: null
        }
      });
    }

    // Create purchase record
    await tx.purchase.create({
      data: {
        userId: user.id,
        courseId: paymentIntent.metadata.courseId,
        paymentIntentId: paymentIntent.id,
        purchaseSource: 'EXTERNAL'
      }
    });

    // Handle course access
    const existingAccess = await tx.courseAccess.findFirst({
      where: {
        userId: user.id,
        courseId: paymentIntent.metadata.courseId
      }
    });

    if (existingAccess) {
      await tx.courseAccess.update({
        where: { id: existingAccess.id },
        data: { active: true }
      });
    } else {
      await tx.courseAccess.create({
        data: {
          userId: user.id,
          courseId: paymentIntent.metadata.courseId,
          active: true
        }
      });
    }

    const course = await tx.course.findUnique({
      where: { id: paymentIntent.metadata.courseId },
      select: { title: true }
    });

    return { user, course, paymentIntent };
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing stripe signature', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      if (paymentIntent.metadata?.source === 'EXTERNAL') {
        const result = await handleExternalPurchaseEvent(paymentIntent);
        
        // Send emails after transaction completes
        try {
          await emailService.sendReceiptEmail({
            email: paymentIntent.metadata.email,
            courseTitle: result.course?.title || 'Unknown Course',
            amount: paymentIntent.amount / 100
          });

          await emailService.sendAdminNotification({
            courseTitle: result.course?.title || 'Unknown Course',
            amount: paymentIntent.amount / 100,
            customerEmail: paymentIntent.metadata.email
          });
        } catch (error) {
          console.error('Failed to send emails:', error);
        }
      }
    }

    return new NextResponse(null, { status: 200 });
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