
import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";

const TRACKING_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function getEncryptionKey(): Buffer {
  const secret = process.env.TRACKING_CODE_ENCRYPTION_KEY;

  if (!secret || !/^[a-fA-F0-9]{64}$/.test(secret)) {
    throw new Error(
      "TRACKING_CODE_ENCRYPTION_KEY must be a 64-character hexadecimal key."
    );
  }

  return Buffer.from(secret, "hex");
}

export function normalizeTrackingCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashTrackingCode(code: string): string {
  return createHash("sha256")
    .update(normalizeTrackingCode(code))
    .digest("hex");
}

/**
 * Encrypts a tracking code using AES-256-GCM.
 * Format: IV:AUTH_TAG:CIPHERTEXT
 */
export function encryptTrackingCode(code: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(normalizeTrackingCode(code), "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * Decrypts an encrypted tracking code.
 */
export function decryptTrackingCode(encryptedCode: string): string {
  const key = getEncryptionKey();

  const parts = encryptedCode.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted tracking code format.");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;

  if (
    !/^[a-fA-F0-9]{24}$/.test(ivHex) ||
    !/^[a-fA-F0-9]{32}$/.test(authTagHex) ||
    !/^[a-fA-F0-9]+$/.test(ciphertextHex) ||
    ciphertextHex.length % 2 !== 0
  ) {
    throw new Error("Invalid encrypted tracking code.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Generates an 80-bit random code.
 * Example: PREM-K7M4-X9QP-2D8A
 */
export function generateTrackingCode(): string {
  const bytes = randomBytes(10);

  let bits = 0;
  let value = 0;
  let encoded = "";

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      encoded += TRACKING_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    encoded += TRACKING_ALPHABET[(value << (5 - bits)) & 31];
  }

  const groups = encoded.match(/.{1,4}/g) ?? [];

  return `PREM-${groups.join("-")}`;
}

export function getTrackingCodeHint(code: string): string {
  const normalized = normalizeTrackingCode(code);
  return normalized.slice(-4);
}
