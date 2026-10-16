import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_test_REPLACE')) {
    return NextResponse.json(
      { error: 'Stripe secret key not configured. Add STRIPE_SECRET_KEY to .env.local' },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(key, {
      apiVersion: '2026-09-30.endive' as any,
    });

    const body = await req.json().catch(() => ({}));
    const customerId = body.customerId;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required to open the billing portal' },
        { status: 400 }
      );
    }

    const appUrl = (
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      req.nextUrl.origin
    ).replace(/\/+$/, '');

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Stripe Portal error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
