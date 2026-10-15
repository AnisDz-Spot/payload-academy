'use client'
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { PLANS, PAYMENT_METHODS, type PlanId } from '@/data/plans';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Spotlight } from '@/components/ui/spotlight';
import { FlipWords } from '@/components/ui/flip-words';

const STRIPE_CONFIGURED =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_REPLACE');

export default function PricingPage() {
  const { toggleTheme, theme } = useAcademy();
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = useCallback(async (planId: PlanId) => {
    if (planId === 'free') {
      window.location.href = '/';
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Checkout session creation failed');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }, []);

  // Map billing mode to visible plans
  const visiblePlans = billingMode === 'lifetime'
    ? PLANS.filter(p => p.id === 'free' || p.id === 'lifetime')
    : PLANS.filter(p => p.id === 'free' || p.id === billingMode);

  const allPlans = PLANS;

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Payload Academy — Pricing</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/dashboard" className="t">📊 Dashboard</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main" style={{ paddingBottom: 80 }}>
        {/* ───── Hero ───── */}
        <section style={{ textAlign: 'center', padding: '64px 24px 40px', position: 'relative', overflow: 'hidden' }}>
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div className="kick" style={{ marginBottom: 12 }}>Simple, Transparent Pricing</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
              Master Payload CMS.<br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                On your terms.
              </span>
            </h1>
            <div className="lead" style={{ maxWidth: 560, margin: '0 auto 32px', fontSize: '1.1rem' }}>
              Get full access to all 50 lessons, 10 interactive tools, the final exam, and your{' '}
              <FlipWords words={['Official Certificate', 'Production Skills', 'Fullstack Mastery', 'Lifetime Updates']} />
            </div>

            {/* Billing Toggle */}
            <div style={{ display: 'inline-flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, gap: 4 }}>
              {[
                { key: 'monthly', label: 'Monthly ($19)' },
                { key: 'annual', label: 'Annual ($99)', badge: 'Save 56%' },
                { key: 'lifetime', label: 'Lifetime ($149 LTD)', badge: 'Save $100' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setBillingMode(opt.key as 'monthly' | 'annual' | 'lifetime')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: billingMode === opt.key ? 'var(--accent)' : 'transparent',
                    color: billingMode === opt.key ? '#fff' : 'var(--text)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {opt.label}
                  {opt.badge && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: 99,
                      background: billingMode === opt.key ? 'rgba(255,255,255,0.25)' : opt.key === 'lifetime' ? 'rgba(245,158,11,0.25)' : 'rgba(99,102,241,0.2)',
                      color: billingMode === opt.key ? '#fff' : opt.key === 'lifetime' ? '#f59e0b' : '#818cf8',
                      textTransform: 'uppercase',
                    }}>
                      {opt.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Pricing Cards ───── */}
        <section style={{ maxWidth: billingMode === 'lifetime' ? 860 : 1100, margin: '0 auto', padding: '0 24px' }}>
          {!STRIPE_CONFIGURED && (
            <div style={{
              margin: '0 0 28px',
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontSize: 13,
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>⚠️</span>
              <span>
                <strong>Demo Mode:</strong> Stripe keys not configured yet. Add your keys to{' '}
                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0 4px', borderRadius: 3 }}>.env.local</code>{' '}
                to enable real payments. Checkout buttons will show the error from the server.
              </span>
            </div>
          )}

          {error && (
            <div style={{
              margin: '0 0 20px',
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: 13,
              color: '#ef4444',
            }}>
              ❌ {error}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: billingMode === 'lifetime'
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            alignItems: 'start',
          }}>
            {allPlans
              .filter(p => {
                if (billingMode === 'monthly') return p.id === 'free' || p.id === 'monthly';
                if (billingMode === 'annual') return p.id === 'free' || p.id === 'annual';
                return p.id === 'free' || p.id === 'lifetime';
              })
              .map(plan => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  loading={loading === plan.id}
                  onCheckout={handleCheckout}
                />
              ))}
          </div>

          {/* Show all plans comparison hint */}
          {billingMode !== 'lifetime' && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onClick={() => setBillingMode('lifetime')}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Looking for lifetime access? →
              </button>
            </div>
          )}
        </section>

        {/* ───── Payment Methods ───── */}
        <section style={{ maxWidth: 900, margin: '56px auto 0', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            All major payment methods accepted
          </div>
          <PaymentMethodGrid />
        </section>

        {/* ───── Full Feature Comparison Table ───── */}
        <section style={{ maxWidth: 1000, margin: '64px auto 0', padding: '0 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Full Feature Comparison</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
            See exactly what&apos;s included in every plan
          </p>
          <ComparisonTable />
        </section>

        {/* ───── FAQ ───── */}
        <section style={{ maxWidth: 720, margin: '64px auto 0', padding: '0 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, marginBottom: 28 }}>Frequently Asked Questions</h2>
          <FaqSection />
        </section>

        {/* ───── Money Back Guarantee ───── */}
        <section style={{
          maxWidth: 600,
          margin: '56px auto 0',
          padding: '28px 32px',
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
          <h3 style={{ margin: '0 0 8px', fontWeight: 800, fontSize: 20 }}>30-Day Money-Back Guarantee</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Not 100% satisfied? Email us within 30 days of your purchase and we&apos;ll refund every cent.
            No questions, no hoops — we stand behind what we build.
          </p>
        </section>
      </main>
    </div>
  );
}

// ─── Pricing Card Component (Aceternity 3D Card) ───────────────────────────────
function PricingCard({
  plan,
  loading,
  onCheckout,
}: {
  plan: typeof PLANS[0];
  loading: boolean;
  onCheckout: (id: PlanId) => void;
}) {
  return (
    <CardContainer className="w-full">
      <CardBody
        style={{
          borderRadius: 20,
          border: `1px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
          background: plan.popular
            ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))'
            : 'var(--card)',
          padding: 28,
          position: 'relative',
          boxShadow: plan.popular ? '0 12px 40px rgba(99,102,241,0.25)' : '0 4px 20px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Badge */}
        {plan.badge && (
          <CardItem
            translateZ={50}
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: plan.badgeColor || 'var(--accent)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              padding: '4px 14px',
              borderRadius: 99,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {plan.badge}
          </CardItem>
        )}

        {/* Plan Header */}
        <div style={{ marginBottom: 20 }}>
          <CardItem translateZ={20} style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {plan.name}
          </CardItem>
          <CardItem translateZ={40} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--text)', margin: '8px 0 0', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span>{plan.priceLabel}</span>
            {plan.originalPriceLabel && (
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--muted)', textDecoration: 'line-through', opacity: 0.7 }}>
                {plan.originalPriceLabel}
              </span>
            )}
            {plan.annualEquivalent && (
              <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}>
                (${plan.annualEquivalent}/mo)
              </span>
            )}
          </CardItem>
          <CardItem translateZ={25} style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {plan.billingLabel}
          </CardItem>
          <CardItem translateZ={30} style={{ fontSize: 13, color: 'var(--text)', margin: '10px 0 0', lineHeight: 1.4 }}>
            {plan.tagline}
          </CardItem>
        </div>

        {/* CTA Button */}
        <CardItem translateZ={45} className="w-full">
          <button
            onClick={() => onCheckout(plan.id)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 15,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 24,
              background: plan.ctaStyle === 'gold'
                ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                : plan.ctaStyle === 'primary'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'var(--panel)',
              color: plan.ctaStyle === 'ghost' ? 'var(--text)' : '#fff',
              border: plan.ctaStyle === 'ghost' ? '1px solid var(--border)' : 'none',
              boxShadow: plan.ctaStyle === 'ghost'
                ? 'none'
                : plan.ctaStyle === 'gold'
                ? '0 4px 20px rgba(245,158,11,0.4)'
                : '0 4px 20px rgba(99,102,241,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Redirecting to Checkout…
              </span>
            ) : plan.cta}
          </button>
        </CardItem>

        {/* Features List */}
        <CardItem translateZ={20} className="w-full">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {plan.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                flexShrink: 0,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 900,
                marginTop: 1,
                background: f.included ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                color: f.included ? '#10b981' : 'var(--muted)',
              }}>
                {f.included ? '✓' : '–'}
              </span>
              <span style={{ fontSize: 13, color: f.included ? 'var(--text)' : 'var(--muted)', lineHeight: 1.4 }}>
                {f.label}
                {f.note && <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>{f.note}</span>}
              </span>
            </div>
          ))}
        </div>
      </CardItem>
    </CardBody>
  </CardContainer>
  );
}

// ─── Payment Methods Grid ──────────────────────────────────────────────────────
function PaymentMethodGrid() {
  const methods = [
    { svg: '💳', name: 'Visa', color: '#1A1F71' },
    { svg: '💳', name: 'Mastercard', color: '#EB001B' },
    { svg: '💳', name: 'Amex', color: '#007BC1' },
    { svg: '💳', name: 'Discover', color: '#FF6600' },
    { svg: '🍎', name: 'Apple Pay', color: '#000' },
    { svg: 'G', name: 'Google Pay', color: '#4285F4', isText: true },
    { svg: '⚡', name: 'Link', color: '#635BFF' },
    { svg: '🏦', name: 'ACH / Bank', color: '#10b981' },
    { svg: '🇪🇺', name: 'SEPA Debit', color: '#003399' },
    { svg: 'K', name: 'Klarna', color: '#FFB3C7', isText: true },
    { svg: '✂️', name: 'Afterpay', color: '#B2FCE4' },
    { svg: 'A', name: 'Affirm', color: '#0FA0D1', isText: true },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
      {methods.map(m => (
        <div
          key={m.name}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          <span style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background: m.isText ? m.color : 'transparent',
            color: m.isText ? '#fff' : 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: m.isText ? 11 : 16,
            fontWeight: 900,
            flexShrink: 0,
          }}>
            {m.svg}
          </span>
          {m.name}
        </div>
      ))}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
        🔒 All payments secured by Stripe — PCI DSS Level 1 compliant
      </div>
    </div>
  );
}

// ─── Full Feature Comparison Table ────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { label: 'Lessons included', values: ['10 (Modules 1–2)', '50 lessons', '50 lessons', '50 lessons'] },
    { label: 'Interactive code challenges', values: ['2', '✓ All 50', '✓ All 50', '✓ All 50'] },
    { label: 'Schema Builder & Query Simulator', values: ['✓', '✓', '✓', '✓'] },
    { label: 'Visual RBAC Matrix & RLS Simulator', values: ['–', '✓', '✓', '✓'] },
    { label: 'Lexical AST Inspector', values: ['–', '✓', '✓', '✓'] },
    { label: 'Live Preview postMessage Studio', values: ['–', '✓', '✓', '✓'] },
    { label: 'Drizzle SQL Visualizer', values: ['–', '✓', '✓', '✓'] },
    { label: 'AI Payload Assistant (✨)', values: ['–', '✓', '✓', '✓'] },
    { label: 'Final Exam', values: ['–', '✓', '✓', '✓'] },
    { label: 'Certificate of Mastery', values: ['–', '✓', '✓', '✓'] },
    { label: 'Gamified achievements & XP', values: ['–', '✓', '✓', '✓'] },
    { label: 'Early access to new modules', values: ['–', '–', '✓', '✓'] },
    { label: 'Priority support', values: ['–', '–', '✓', '✓'] },
    { label: 'Lifetime content updates', values: ['–', 'While subscribed', 'While subscribed', '✓ Forever'] },
    { label: 'Price', values: ['$0', '$19/mo', '$99/yr', '$149 LTD (reg. $249)'] },
  ];

  const headers = ['Feature', 'Free', 'Monthly', 'Annual', 'Lifetime'];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                style={{
                  padding: '10px 14px',
                  fontWeight: 800,
                  borderBottom: '2px solid var(--border)',
                  color: i === 0 ? 'var(--muted)' : i === 3 ? 'var(--accent)' : 'var(--text)',
                  background: i === 3 ? 'rgba(99,102,241,0.05)' : i === 4 ? 'rgba(245,158,11,0.05)' : 'transparent',
                  fontSize: i === 0 ? 11 : 13,
                  textTransform: i === 0 ? 'uppercase' : 'none',
                  letterSpacing: i === 0 ? '0.06em' : 'normal',
                  textAlign: i === 0 ? 'left' : 'center',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={row.label}
              style={{
                borderBottom: '1px solid var(--border)',
                background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
            >
              <td style={{ padding: '9px 14px', color: 'var(--text)', fontWeight: 500 }}>{row.label}</td>
              {row.values.map((v, vi) => (
                <td
                  key={vi}
                  style={{
                    padding: '9px 14px',
                    textAlign: 'center',
                    color: v === '✓' || v.startsWith('✓') ? '#10b981' : v === '–' ? 'var(--muted)' : vi === 2 ? 'var(--accent)' : vi === 3 ? '#f59e0b' : 'var(--text)',
                    fontWeight: v === '✓' || v.startsWith('✓') ? 700 : 400,
                    background: vi === 2 ? 'rgba(99,102,241,0.04)' : vi === 3 ? 'rgba(245,158,11,0.04)' : 'transparent',
                  }}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I cancel my subscription at any time?',
      a: 'Yes, absolutely. Monthly and annual subscriptions can be canceled at any time from your billing portal. You\'ll retain access until the end of your current billing period.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, Stripe Link, ACH bank transfers, SEPA direct debit, and buy-now-pay-later options including Klarna, Afterpay, and Affirm.',
    },
    {
      q: 'Is my payment information secure?',
      a: 'Your payment data is processed exclusively by Stripe, the world\'s most trusted payment processor, certified at PCI DSS Level 1. We never store your raw card details.',
    },
    {
      q: 'What\'s the difference between annual and lifetime?',
      a: 'Annual gives you 12 months of full access plus early access to new modules — you\'ll need to renew each year. Lifetime is a one-time payment that gives you access forever, including all future content updates, with no renewal.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes. We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied, email us within 30 days and we\'ll issue a full refund — no questions asked.',
    },
    {
      q: 'Can I switch between plans?',
      a: 'Yes. You can upgrade from Monthly to Annual at any time, and we\'ll prorate the difference. Upgrading to Lifetime is also available at any point.',
    },
    {
      q: 'Is there a student or team discount?',
      a: 'We\'re working on team and educational pricing. Contact us at hello@payloadacademy.dev with your details and we\'ll work something out.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'var(--card)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'left',
              gap: 12,
            }}
          >
            {faq.q}
            <span style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.15)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              transition: 'transform 0.2s ease',
              transform: openIdx === i ? 'rotate(45deg)' : 'none',
            }}>
              +
            </span>
          </button>
          {openIdx === i && (
            <div style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
