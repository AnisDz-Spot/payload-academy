import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// ── Stripe instance ────────────────────────────────────────────────────────────
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_test_REPLACE')) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Add it to .env.local');
  }
  _stripe = new Stripe(key);
  return _stripe;
}

// ── Price ID map ───────────────────────────────────────────────────────────────
const PRICE_MAP: Record<string, string | undefined> = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY,
  annual:   process.env.STRIPE_PRICE_ANNUAL,
  lifetime: process.env.STRIPE_PRICE_LIFETIME,
};

export async function POST(req: NextRequest) {
  try {
    const { planId, email } = await req.json() as { planId: string; email?: string };

    if (!planId || !PRICE_MAP[planId]) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    const priceId = PRICE_MAP[planId];
    if (!priceId || priceId.startsWith('price_REPLACE')) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan. Set STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL / STRIPE_PRICE_LIFETIME in .env.local' },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const isLifetime = planId === 'lifetime';

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: false },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      metadata: {
        planId,
        source: 'payload-academy',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe checkout error]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
