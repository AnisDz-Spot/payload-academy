import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserProStatus, updateUserProStatusByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || key.startsWith('sk_test_REPLACE') || !webhookSecret || webhookSecret.startsWith('whsec_REPLACE')) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = new Stripe(key);
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('[Stripe webhook] Signature verification failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  console.log('[Stripe webhook] Received event:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const planId = (session.metadata?.planId || 'monthly') as 'monthly' | 'annual' | 'lifetime';
      const customerEmail = session.customer_details?.email || session.customer_email;
      const userId = session.metadata?.userId;

      console.log('[Stripe webhook] Checkout completed:', session.id, 'Plan:', planId, 'Email:', customerEmail);
      
      if (userId) {
        updateUserProStatus(userId, true, planId);
      } else if (customerEmail) {
        updateUserProStatusByEmail(customerEmail, true, planId);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('[Stripe webhook] Subscription updated:', subscription.id, 'Status:', subscription.status);
      const isSubActive = subscription.status === 'active' || subscription.status === 'trialing';
      const userId = subscription.metadata?.userId;
      if (userId) {
        updateUserProStatus(userId, isSubActive, isSubActive ? 'monthly' : 'free');
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('[Stripe webhook] Subscription canceled:', subscription.id);
      const userId = subscription.metadata?.userId;
      if (userId) {
        updateUserProStatus(userId, false, 'free');
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('[Stripe webhook] Invoice paid:', invoice.id);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('[Stripe webhook] Payment failed:', invoice.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
