import { generateKeyPair, encrypt, decrypt } from './crypto';

describe('Crypto Helpers', () => {
  it('should generate valid key pair', () => {
    const keys = generateKeyPair();
    expect(keys.publicKey).toBeDefined();
    expect(keys.privateKey).toBeDefined();

    // basic check for base64 string
    expect(Buffer.from(keys.publicKey, 'base64').length).toBe(32); // sodium.crypto_box_PUBLICKEYBYTES
    expect(Buffer.from(keys.privateKey, 'base64').length).toBe(32); // sodium.crypto_box_SECRETKEYBYTES
  });

  it('should encrypt and decrypt a message correctly', () => {
    const { publicKey, privateKey } = { publicKey: 'm2hvSiZj1ZWpZtRyYDy2TaFHhvuwCjmdvj80NZW6pWU=', privateKey: 'MgQ3LwWFc2kdkOzkNk3jWVH832qiTjPMuBT8jV2DEBE=' };
    const message = 'Hello, World!';

    const encrypted = encrypt(message, publicKey);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(message);

    const decrypted = decrypt(encrypted, privateKey);
    expect(decrypted).toBe(message);
  });

  it('should return null when decryption fails with wrong key', () => {
    const { publicKey } = { publicKey: 'm2hvSiZj1ZWpZtRyYDy2TaFHhvuwCjmdvj80NZW6pWU=' };
    const { privateKey: otherPrivateKey } = { privateKey: '123' };
    const message = 'Wrong Key Test';
    const encrypted = encrypt(message, publicKey);

    const decrypted = decrypt(encrypted, otherPrivateKey);
    expect(decrypted).toBeNull();
  });

  it('should return null for malformed ciphertext', () => {
    const { privateKey } = { privateKey: 'MgQ3LwWFc2kdkOzkNk3jWVH832qiTjPMuBT8jV2DEBE=' };
    const decrypted = decrypt('invalid-base64', privateKey);
    expect(decrypted).toBeNull();
  });
});
