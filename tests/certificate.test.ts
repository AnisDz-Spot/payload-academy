import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeCertificateSignature, verifyCertificateSignature } from '@/lib/db';
import type { DbCertificate } from '@/lib/db';

const base = {
  id: 'cert_test_1',
  recipientName: 'Alice Chen',
  score: 92,
  issuedAt: '2026-01-01T00:00:00.000Z',
};

function asCert(signature: string): DbCertificate {
  return { ...base, signature } as unknown as DbCertificate;
}

test('signature is deterministic for identical input', () => {
  assert.equal(computeCertificateSignature(base), computeCertificateSignature({ ...base }));
});

test('signature is 64-char hex (sha256)', () => {
  assert.match(computeCertificateSignature(base), /^[0-9a-f]{64}$/);
});

test('changing any sealed field changes the signature', () => {
  const original = computeCertificateSignature(base);
  assert.notEqual(original, computeCertificateSignature({ ...base, score: 80 }));
  assert.notEqual(original, computeCertificateSignature({ ...base, recipientName: 'Bob' }));
  assert.notEqual(original, computeCertificateSignature({ ...base, id: 'cert_test_2' }));
});

test('verify accepts an untampered signature', () => {
  const signature = computeCertificateSignature(base);
  assert.equal(verifyCertificateSignature(asCert(signature)), true);
});

test('verify rejects a tampered signature', () => {
  const signature = computeCertificateSignature(base);
  const last = signature.slice(-1);
  const tampered = signature.slice(0, -1) + (last === '0' ? '1' : '0');
  assert.equal(verifyCertificateSignature(asCert(tampered)), false);
});

test('verify rejects a wrong-length signature without throwing', () => {
  assert.equal(verifyCertificateSignature(asCert('deadbeef')), false);
});
