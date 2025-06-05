import { NextResponse } from "next/server";
import { getAuthSession } from "../../../lib/auth";
import Stripe from "stripe";
import { PROMO_CODES, PromoCodeKey } from '../../../lib/promoCodeMapping';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    // Get the Stripe promotion code ID from our mapping
    const upperCode = code.toUpperCase();
    if (!(upperCode in PROMO_CODES)) {
      return NextResponse.json({ error: "Invalid discount code" }, { status: 400 });
    }

    const promoCodeId = PROMO_CODES[upperCode as PromoCodeKey];

    // Fetch the promotion code from Stripe
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
    });

    if (promotionCodes.data.length === 0) {
      return NextResponse.json({ error: "Invalid discount code" }, { status: 400 });
    }

    const promotionCode = promotionCodes.data[0];
    
    // Check if the code has expired
    if (promotionCode.expires_at && promotionCode.expires_at < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: "Discount code has expired" }, { status: 400 });
    }

    // Return the discount amount and promotion code ID
    const coupon = await stripe.coupons.retrieve(promotionCode.coupon.id);
    const amount = coupon.amount_off ? coupon.amount_off / 100 : 0;

    console.log('Received code:', code);
    console.log('Found promotion code:', {
      id: promotionCode.id,
      code: promotionCode.code,
      coupon: promotionCode.coupon
    });
    console.log('Coupon details:', coupon);

    return NextResponse.json({ 
      success: true,
      amount,
      promotionCode: promoCodeId, // Use the mapped promo code ID
      couponId: promotionCode.coupon.id,
      promoCodeDetails: promotionCode
    });
  } catch (error) {
    console.error('Discount validation error:', error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
} 