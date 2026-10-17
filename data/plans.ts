import { LESSON_COUNT, CURRICULUM_MODULE_COUNT } from './curriculum';

export type PlanId = 'free' | 'monthly' | 'annual' | 'lifetime';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number | null; // null = free
  originalPrice?: number; // for displaying strikethrough original price e.g. $249
  originalPriceLabel?: string;
  annualEquivalent?: number; // per-month equivalent when billed annually
  priceLabel: string;
  billingLabel: string;
  stripeEnvKey?: string; // env var name for price ID
  badge?: string;
  badgeColor?: string;
  cta: string;
  ctaStyle: 'ghost' | 'primary' | 'gold';
  popular?: boolean;
  features: { label: string; included: boolean; note?: string }[];
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    tagline: 'Start learning Payload CMS foundations today',
    price: 0,
    priceLabel: '$0',
    billingLabel: 'forever free · no card required',
    cta: 'Start for Free',
    ctaStyle: 'ghost',
    features: [
      { label: 'First 2 modules (10 foundation lessons)', included: true },
      { label: 'Schema Builder & Query Simulator', included: true },
      { label: 'Payload Glossary & Changelog Explorer', included: true },
      { label: 'Community Discord Access', included: true },
      { label: `All ${LESSON_COUNT} deep lessons (${CURRICULUM_MODULE_COUNT} full modules)`, included: false },
      { label: 'Interactive coding challenges with test suites', included: false },
      { label: 'Visual RBAC Matrix & Lexical Inspector', included: false },
      { label: 'Live Preview Simulator & Drizzle Visualizer', included: false },
      { label: 'Final Certification Exam access', included: false },
      { label: 'Verified Certificate of Mastery + Public Link', included: false },
      { label: 'Lifetime content updates & new modules', included: false },
    ],
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    tagline: 'Full curriculum & tool suite, billed monthly',
    price: 19,
    priceLabel: '$19',
    billingLabel: 'per month · cancel anytime',
    stripeEnvKey: 'STRIPE_PRICE_MONTHLY',
    cta: 'Start Pro Monthly ($19/mo)',
    ctaStyle: 'primary',
    features: [
      { label: `All ${LESSON_COUNT} deep lessons across ${CURRICULUM_MODULE_COUNT} modules`, included: true },
      { label: 'Guided coding challenges with automated checks', included: true },
      { label: 'Visual RBAC Matrix & RLS Simulator', included: true },
      { label: 'Lexical AST Inspector & React Serializer', included: true },
      { label: 'Live Preview postMessage Studio', included: true },
      { label: 'Drizzle SQL Visualizer & Config Linter', included: true },
      { label: 'Final Exam & Verified Certificate of Mastery', included: true },
      { label: 'AI Payload Assistant (✨)', included: true },
      { label: 'Study Streak & Gamified XP Leaderboards', included: true },
      { label: 'Full code repository access & starter kits', included: true },
      { label: 'Lifetime content updates', included: false, note: 'Included while subscribed' },
    ],
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    tagline: 'Save 56% vs monthly — best value for professional developers',
    price: 99,
    annualEquivalent: 8.25,
    priceLabel: '$99',
    billingLabel: 'per year ($8.25/mo) · billed annually',
    stripeEnvKey: 'STRIPE_PRICE_ANNUAL',
    badge: 'Most Popular · Save 56%',
    badgeColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    cta: 'Start Pro Annual ($99/yr)',
    ctaStyle: 'primary',
    popular: true,
    features: [
      { label: 'Everything in Pro Monthly', included: true },
      { label: 'Save $129/year compared to monthly billing', included: true },
      { label: 'Early access to new modules & beta lessons', included: true },
      { label: 'Priority community & GitHub issue support', included: true },
      { label: 'Downloadable Payload Architecture Study Guide (PDF)', included: true },
      { label: `All ${LESSON_COUNT} deep lessons across ${CURRICULUM_MODULE_COUNT} modules`, included: true },
      { label: 'Guided coding challenges with automated checks', included: true },
      { label: 'Final Exam & Verified Certificate of Mastery', included: true },
      { label: 'AI Payload Assistant (✨)', included: true },
      { label: 'Gamified achievements & XP Leaderboards', included: true },
      { label: 'Lifetime content updates', included: false, note: 'Included while subscribed' },
    ],
  },
  {
    id: 'lifetime',
    name: 'Founding Member LTD',
    tagline: 'Pay once. Own everything forever. No recurring fees.',
    price: 149,
    originalPrice: 249,
    originalPriceLabel: '$249',
    priceLabel: '$149',
    billingLabel: 'one-time payment · lifetime access',
    stripeEnvKey: 'STRIPE_PRICE_LIFETIME',
    badge: '🔥 Founding Member Deal ($100 OFF)',
    badgeColor: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    cta: 'Claim Lifetime Access ($149 LTD)',
    ctaStyle: 'gold',
    features: [
      { label: 'Everything in Pro Annual', included: true },
      { label: 'Lifetime access to all future Payload 3.x & 4.x courses', included: true },
      { label: 'All future modules & interactive tools at no extra cost', included: true },
      { label: 'Priority 1-on-1 email & architecture advice', included: true },
      { label: 'Exclusive "Founding Member" Discord badge & private channel', included: true },
      { label: `All ${LESSON_COUNT} deep lessons across ${CURRICULUM_MODULE_COUNT} modules`, included: true },
      { label: 'Guided coding challenges with automated checks', included: true },
      { label: 'Final Exam & Verified Certificate of Mastery', included: true },
      { label: 'AI Payload Assistant (✨)', included: true },
      { label: 'Gamified achievements & XP Leaderboard', included: true },
      { label: 'Never pay a subscription fee again, ever', included: true },
    ],
  },
];

export const PAYMENT_METHODS = [
  { name: 'Visa', icon: '💳', category: 'card' },
  { name: 'Mastercard', icon: '💳', category: 'card' },
  { name: 'American Express', icon: '💳', category: 'card' },
  { name: 'Discover', icon: '💳', category: 'card' },
  { name: 'Apple Pay', icon: '🍎', category: 'wallet' },
  { name: 'Google Pay', icon: 'G', category: 'wallet' },
  { name: 'Link', icon: '⚡', category: 'wallet' },
  { name: 'ACH Bank Transfer', icon: '🏦', category: 'bank' },
  { name: 'SEPA Debit', icon: '🇪🇺', category: 'bank' },
  { name: 'Klarna', icon: 'K', category: 'bnpl' },
  { name: 'Afterpay', icon: '✂️', category: 'bnpl' },
  { name: 'Affirm', icon: 'A', category: 'bnpl' },
];
