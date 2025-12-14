import { expect, test, describe } from "vitest";
import { generateKeyPair, encrypt } from "./crypto";

describe("Crypto Helpers", () => {
  test("generateKeyPair should return valid keys", () => {
    const keys = generateKeyPair();
    expect(keys.publicKey).toBeDefined();
    expect(keys.privateKey).toBeDefined();
    expect(typeof keys.publicKey).toBe("string");
    expect(typeof keys.privateKey).toBe("string");
    // NaCl keys are 32 bytes, base64 encoded length should be approx 44 chars
    expect(keys.publicKey.length).toBeGreaterThan(0);
    expect(keys.privateKey.length).toBeGreaterThan(0);
  });

  test("encrypt should return encrypted string", () => {
    const publicKey = 'm2hvSiZj1ZWpZtRyYDy2TaFHhvuwCjmdvj80NZW6pWU=';
    const message = "Hello, World!";
    const encrypted = encrypt(message, publicKey);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(message);
    expect(typeof encrypted).toBe("string");

    // Log vectors for server test
    console.log(JSON.stringify({
      publicKey,
      message,
      encrypted
    }));
    console.log("TEST_VECTOR_END");
  });
});
