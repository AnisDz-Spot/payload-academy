// lib/certificate.ts
//
// Server-only helpers for turning a stored certificate into an Open Badges 2.0
// assertion. The assertion is publicly resolvable at /api/badges/[id] and is
// sealed with an HMAC signature that observes the certificate's immutable
// fields, so a tampered assertion fails verification.

import type { DbCertificate } from './db';

export const OPEN_BADGES_CONTEXT = 'https://w3id.org/openbadges/v2';

export function appUrl(): string {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export function certificateVerifyUrl(id: string): string {
  return `${appUrl()}/verify/${id}`;
}

export function buildBadgeAssertion(cert: DbCertificate): Record<string, unknown> {
  const base = appUrl();
  const identity = cert.recipientEmail || cert.recipientName;

  return {
    '@context': OPEN_BADGES_CONTEXT,
    type: 'Assertion',
    id: `${base}/api/badges/${cert.id}`,
    recipient: { type: 'email', hashed: false, identity },
    badge: {
      id: `${base}/api/badges/${cert.id}/badge-class`,
      type: 'BadgeClass',
      name: 'Payload CMS 3.x Certified Developer',
      description:
        'Awarded for completing all 50 Payload Academy lessons, passing every quiz, and scoring 80% or higher on the Final Mastery Exam.',
      image: `${base}/api/og/certificate?id=${encodeURIComponent(cert.id)}&name=${encodeURIComponent(cert.recipientName)}&score=${cert.score}`,
      criteria: {
        id: `${base}/certificate`,
        narrative:
          'Complete all 50 lessons, pass every quiz, and score at least 80% on the Final Mastery Exam.',
      },
      issuer: {
        id: `${base}/`,
        type: 'Issuer',
        name: 'Payload Academy',
        url: base,
      },
    },
    verification: { type: 'hosted' },
    issuedOn: cert.issuedAt,
    evidence: [
      {
        id: certificateVerifyUrl(cert.id),
        narrative: `Final exam score: ${cert.score}%`,
      },
    ],
    signature: {
      type: 'HmacSha256',
      created: cert.issuedAt,
      signatureValue: cert.signature,
    },
  };
}
