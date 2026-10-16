import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, verifyCertificateSignature } from '@/lib/db';
import { certificateVerifyUrl } from '@/lib/certificate';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cert = await getCertificateById(id);

  if (!cert) {
    return NextResponse.json(
      { valid: false, error: 'No certificate found for this ID.' },
      { status: 404 },
    );
  }

  const valid = verifyCertificateSignature(cert);

  return NextResponse.json({
    valid,
    certificate: {
      id: cert.id,
      recipientName: cert.recipientName,
      score: cert.score,
      issuedAt: cert.issuedAt,
      verifyUrl: certificateVerifyUrl(cert.id),
      badgeUrl: `/api/badges/${cert.id}`,
    },
  });
}
