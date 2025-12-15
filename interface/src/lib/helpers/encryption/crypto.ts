import _sodium from 'libsodium-wrappers';
import * as nacl from 'tweetnacl';

/**
 * Generates a new key pair for anonymous public key encryption.
 * @returns {Promise<Record<'publicKey' | 'privateKey', string>>} Base64 encoded public and private keys.
 */
export const generateKeyPair = async (): Promise<{ publicKey: string; privateKey: string }> => {
  await _sodium.ready;
  const sodium = _sodium;
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL),
    privateKey: sodium.to_base64(keyPair.privateKey, sodium.base64_variants.ORIGINAL),
  };
};

/**
 * Encrypts a message using the recipient's public key only (anonymous sender).
 * To be used by the frontend to encrypt sensitive data before sending it to the server.
 * @param message The plaintext message to encrypt.
 * @param publicKey The recipient's Base64 encoded public key.
 * @returns {Promise<string>} Base64 encoded encrypted message.
 */
export const encrypt = async (message: string, publicKey: string): Promise<string> => {
  await _sodium.ready;
  const sodium = _sodium;

  const publicKeyBytes = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
  const ciphertext = sodium.crypto_box_seal(message, publicKeyBytes);

  return sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL);
};

export const encryptSecret = encrypt;

/**
 * Decrypts an anonymous message using the recipient's private key.
 * @param encryptedMessage The Base64 encoded encrypted message.
 * @param privateKey The recipient's Base64 encoded private key.
 * @returns {Promise<string | null>} The decrypted plaintext string, or null if decryption fails.
 */
export const decrypt = async (encryptedMessage: string, privateKey: string): Promise<string | null> => {
  await _sodium.ready;
  const sodium = _sodium;

  try {
    const ciphertext = sodium.from_base64(encryptedMessage, sodium.base64_variants.ORIGINAL);
    const privateKeyBytes = sodium.from_base64(privateKey, sodium.base64_variants.ORIGINAL);

    // libsodium crypto_box_seal_open requires the public key as well
    const publicKeyBytes = sodium.crypto_scalarmult_base(privateKeyBytes);

    const decrypted = sodium.crypto_box_seal_open(ciphertext, publicKeyBytes, privateKeyBytes);

    return sodium.to_string(decrypted);
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
