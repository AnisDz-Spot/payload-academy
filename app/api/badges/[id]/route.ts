import { NextRequest, NextResponse } from 'next/server';
import { getCertificateById, verifyCertificateSignature } from '@/lib/db';
import { buildBadgeAssertion } from '@/lib/certificate';

export const runtime = 'nodejs';

// Public Open Badges 2.0 assertion endpoint. The signature is recomputed from
// the stored certificate, so a forged record fails verification.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cert = await getCertificateById(id);

  if (!cert || !verifyCertificateSignature(cert)) {
    return NextResponse.json({ error: 'Badge assertion not found.' }, { status: 404 });
  }

  return NextResponse.json(buildBadgeAssertion(cert), {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
