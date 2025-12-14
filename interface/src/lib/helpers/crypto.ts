
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';


/**
 * Generates a new key pair for anonymous public key encryption.
 * @returns {Record<'publicKey' | 'privateKey', string>} Base64 encoded public and private keys.
 */
export const generateKeyPair = (): { publicKey: string; privateKey: string } => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
};

/**
 * Encrypts a message using the recipient's public key only (anonymous sender).
 * To be used by the frontend to encrypt sensitive data before sending it to the server.
 * @param message The plaintext message to encrypt.
 * @param publicKey The recipient's Base64 encoded public key.
 * @returns {string} Base64 encoded encrypted message.
 */
export const encrypt = (message: string, publicKey: string): string => {
  const publicKeyBytes = naclUtil.decodeBase64(publicKey);
  const messageBytes = naclUtil.decodeUTF8(message);

  // Inline sealedbox implementation to avoid tweetnacl-sealed-box environment issues
  const ek = nacl.box.keyPair();

  // Nonce = HSalsa20(hash(epk || pk), 0) or just hash(epk || pk) truncated?
  // libsodium crypto_box_seal uses: nonce = crypto_generichash(epk || pk)
  // tweetnacl-sealed-box uses: nonce = hash(epk || pk)
  const nonceInput = new Uint8Array(64);
  nonceInput.set(ek.publicKey);
  nonceInput.set(publicKeyBytes, 32);
  const hash = nacl.hash(nonceInput);
  const nonce = hash.subarray(0, 24);

  const boxed = nacl.box(messageBytes, nonce, publicKeyBytes, ek.secretKey);

  const encryptedBytes = new Uint8Array(ek.publicKey.length + boxed.length);
  encryptedBytes.set(ek.publicKey);
  encryptedBytes.set(boxed, ek.publicKey.length);

  return naclUtil.encodeBase64(encryptedBytes);
};

/**
 * Decrypts an anonymous message using the recipient's private key.
 * @param encryptedMessage The Base64 encoded encrypted message.
 * @param privateKey The recipient's Base64 encoded private key.
 * @returns {string | null} The decrypted plaintext string, or null if decryption fails.
 */
export const decrypt = (encryptedMessage: string, privateKey: string): string | null => {
  try {
    const encryptedBytes = naclUtil.decodeBase64(encryptedMessage);
    const privateKeyBytes = naclUtil.decodeBase64(privateKey);
    // @ts-ignore
    const decryptedBytes = sealedBox.sealedbox.open(encryptedBytes, publicKeyBytes(privateKeyBytes), privateKeyBytes);

    if (!decryptedBytes) {
      return null;
    }
    return naclUtil.encodeUTF8(decryptedBytes);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Helper to derive public key from private key if needed internally.
 * @param privateKey Base64 encoded private key
 */
const publicKeyBytes = (privateKeyBytes: Uint8Array): Uint8Array => {
  return nacl.box.keyPair.fromSecretKey(privateKeyBytes).publicKey;
}
