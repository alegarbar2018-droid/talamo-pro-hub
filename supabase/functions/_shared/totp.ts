/**
 * TOTP (Time-based One-Time Password) Generator
 * Generates 6-digit codes compatible with Exness 2FA
 */

/**
 * Decode base32 string to Uint8Array
 */
function base32Decode(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanedBase32 = base32.toUpperCase().replace(/=+$/, '');
  
  let bits = '';
  for (const char of cleanedBase32) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error('Invalid base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }
  
  return bytes;
}

/**
 * HMAC-SHA1 implementation
 */
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  return new Uint8Array(signature);
}

/**
 * Generate TOTP code from secret
 * @param secret Base32-encoded secret key
 * @param timeStep Time step in seconds (default: 30)
 * @returns 6-digit TOTP code
 */
export async function generateTOTP(secret: string, timeStep = 30): Promise<string> {
  // Get current time counter
  const time = Math.floor(Date.now() / 1000 / timeStep);
  
  // Convert time to 8-byte array
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(time), false);
  
  // Decode secret from base32
  const key = base32Decode(secret);
  
  // Generate HMAC-SHA1
  const hmac = await hmacSha1(key, new Uint8Array(buffer));
  
  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0xf;
  const binary = 
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  // Generate 6-digit code
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}
