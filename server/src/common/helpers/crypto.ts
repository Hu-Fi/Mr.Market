import * as sodium from 'sodium-native';

/**
 * Generates a new key pair for anonymous public key encryption from the server side.
 * @returns {Record<'publicKey' | 'privateKey', string>} Base64 encoded public and private keys.
 */
export const generateKeyPair = (): { publicKey: string; privateKey: string } => {
  const publicKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES);
  const privateKey = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES);
  sodium.crypto_box_keypair(publicKey, privateKey);

  return {
    publicKey: publicKey.toString('base64'),
    privateKey: privateKey.toString('base64'),
  };
};

/**
 * Derives the public key from a given private key.
 * @param privateKey The Base64 encoded private key.
 * @returns {string} The Base64 encoded public key.
 */
export const getPublicKeyFromPrivate = (privateKey: string): string => {
  let secretKey = Buffer.from(privateKey, 'base64');

  // Handle PKCS#8 format (approx 62 bytes starting with header) by extracting last 32 bytes
  if (secretKey.length > sodium.crypto_box_SECRETKEYBYTES) {
    secretKey = secretKey.subarray(secretKey.length - sodium.crypto_box_SECRETKEYBYTES);
  }

  const publicKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES);
  sodium.crypto_scalarmult_base(publicKey, secretKey);
  return publicKey.toString('base64');
};

/**
 * Encrypts a message using the recipient's public key only (anonymous sender).
 * To be used by the frontend to encrypt sensitive data before sending it to the server.
 * @param message The plaintext message to encrypt.
 * @param publicKey The recipient's Base64 encoded public key.
 * @returns {string} Base64 encoded encrypted message.
 */
export const encrypt = (message: string, publicKey: string): string => {
  const messageBuf = Buffer.from(message, 'utf8');
  const publicKeyBuf = Buffer.from(publicKey, 'base64');

  const ciphertext = Buffer.alloc(messageBuf.length + sodium.crypto_box_SEALBYTES);

  sodium.crypto_box_seal(ciphertext, messageBuf, publicKeyBuf);

  return ciphertext.toString('base64');
};

/**
 * Decrypts an anonymous message using the recipient's private key.
 * To be used by the server to decrypt sensitive data received from the frontend.
 * @param encryptedMessage The Base64 encoded encrypted message.
 * @param privateKey The recipient's Base64 encoded private key.
 * @returns {string | null} The decrypted plaintext string, or null if decryption fails.
 */
export const decrypt = (encryptedMessage: string, privateKey: string): string | null => {
  try {
    const ciphertext = Buffer.from(encryptedMessage, 'base64');
    let secretKey = Buffer.from(privateKey, 'base64');

    // Handle PKCS#8 format
    if (secretKey.length > sodium.crypto_box_SECRETKEYBYTES) {
      secretKey = secretKey.subarray(secretKey.length - sodium.crypto_box_SECRETKEYBYTES);
    }

    // Check lengths
    if (ciphertext.length < sodium.crypto_box_SEALBYTES) return null;

    // Derive public key from secret key (required for seal_open)
    const publicKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES);
    sodium.crypto_scalarmult_base(publicKey, secretKey);

    const decrypted = Buffer.alloc(ciphertext.length - sodium.crypto_box_SEALBYTES);

    const success = sodium.crypto_box_seal_open(decrypted, ciphertext, publicKey, secretKey);

    if (!success) {
      return null;
    }

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
