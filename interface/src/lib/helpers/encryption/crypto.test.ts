import { expect, test, describe } from "vitest";
import { generateKeyPair, encrypt, encryptSecret, decrypt } from "./crypto";

describe("Crypto Helpers", () => {
  test("generateKeyPair should return valid keys", async () => {
    const keys = await generateKeyPair();
    expect(keys.publicKey).toBeDefined();
    expect(keys.privateKey).toBeDefined();
    expect(typeof keys.publicKey).toBe("string");
    expect(typeof keys.privateKey).toBe("string");
    expect(keys.publicKey.length).toBeGreaterThan(0);
    expect(keys.privateKey.length).toBeGreaterThan(0);
  });

  test("encrypt should return encrypted string", async () => {
    // Generate a valid keypair first to test against real keys
    const keys = await generateKeyPair();
    const publicKey = keys.publicKey;
    const message = "Hello, World!";

    const encrypted = await encrypt(message, publicKey);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(message);
    expect(typeof encrypted).toBe("string");

    // Verify decryption
    const decrypted = await decrypt(encrypted, keys.privateKey);
    expect(decrypted).toBe(message);
  });

  test("encryptSecret should be the same as encrypt", () => {
    expect(encryptSecret).toBe(encrypt);
  });
});
