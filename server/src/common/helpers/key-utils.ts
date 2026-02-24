// src/modules/strategy/solana-volume/utils/key-utils.ts

/**
 * Parse a Solana private key from common formats into a Uint8Array:
 * - JSON array of numbers (solana-keygen output)
 * - hex string (with or without 0x)
 * - base64 string
 */
export function parsePrivateKeyToUint8Array(input: string): Uint8Array {
  if (!input) throw new Error('Empty private key');

  const s = input.trim();

  // JSON array (solana-keygen)
  if (s.startsWith('[') && s.endsWith(']')) {
    const arr = JSON.parse(s);
    if (!Array.isArray(arr))
      throw new Error('Invalid JSON array for private key');
    return new Uint8Array(arr.map((n: unknown) => Number(n)));
  }

  // hex (prefer hex before base64 to avoid mis-parsing pure hex as base64)
  const hex = s.toLowerCase().replace(/^0x/, '');
  if (/^[0-9a-f]+$/.test(hex) && hex.length % 2 === 0) {
    return new Uint8Array(Buffer.from(hex, 'hex'));
  }

  // base64
  try {
    const buf = Buffer.from(s, 'base64');
    if (buf.length > 0) return new Uint8Array(buf);
  } catch (_) {
    // fallthrough
  }

  throw new Error(
    'Unsupported private key format. Use solana-keygen JSON array, hex, or base64.',
  );
}
