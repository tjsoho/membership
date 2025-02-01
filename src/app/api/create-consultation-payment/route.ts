import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, promotionCode } = await request.json();
    console.log('Creating payment intent with promotion code:', promotionCode);

    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: 29900, // $299.00 AUD
      currency: "aud",
      metadata: {
        userId: session.user.id,
        productId,
        type: "consultation"
      }
    };

    if (promotionCode) {
      console.log('Adding promotion code to payment intent:', promotionCode);
      paymentIntentData.discounts = [{
        promotion_code: promotionCode
      }];
    }

    console.log('Payment intent data:', paymentIntentData);
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    console.log('Created payment intent:', paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: "Failed to create payment intent", details: error },
      { status: 500 }
    );
  }
} 