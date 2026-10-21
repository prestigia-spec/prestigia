import crypto from 'crypto';

/**
 * RFC-6238 Time-Based One-Time Password (TOTP) Implementation
 * Zero external dependencies. Uses Node.js native crypto.
 */

// Convert Base32 string to Buffer
export function base32ToBuffer(str: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  const clean = str.toUpperCase().replace(/[\s=-]/g, '');
  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

// Generate 6-digit TOTP code for a specific counter step
export function generateTOTPAtStep(secret: string, step: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(step));
  const key = base32ToBuffer(secret);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1000000;
  return code.toString().padStart(6, '0');
}

// Generate current 6-digit TOTP code
export function generateTOTP(secret: string, timeStep = 30): string {
  const currentStep = Math.floor(Date.now() / 1000 / timeStep);
  return generateTOTPAtStep(secret, currentStep);
}

// Verify TOTP code with window drift tolerance (+/- 1 step = +/- 30s)
export function verifyTOTP(token: string, secret: string, window = 1, timeStep = 30): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim();
  if (cleanToken.length !== 6) return false;

  const currentStep = Math.floor(Date.now() / 1000 / timeStep);

  for (let drift = -window; drift <= window; drift++) {
    const expected = generateTOTPAtStep(secret, currentStep + drift);
    if (expected === cleanToken) {
      return true;
    }
  }
  return false;
}

// Generate standard otpauth URL for QR codes / Authenticator apps
export function getTOTPAuthUrl(
  secret: string,
  accountName = 'Dirección General',
  issuer = 'Prestigia Banking'
): string {
  const cleanSecret = secret.toUpperCase().replace(/[\s=-]/g, '');
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${cleanSecret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
