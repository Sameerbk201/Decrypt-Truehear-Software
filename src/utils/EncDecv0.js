import crypto from "crypto";

/**
 * EncDec class provides utility methods for:
 * - AES-256-CBC encryption
 * - AES-256-CBC decryption
 * - SHA-256 hashing
 *
 * The class requires an AES secret key and IV (initialization vector) in hex format.
 */
export class EncDecv0 {
  /**
   * Constructs an EncDec instance with provided AES key and IV.
   * @param {string} secretKeyHex - AES 256-bit key in hexadecimal format (64 characters)
   * @param {string} ivHex - AES initialization vector in hexadecimal format (32 characters)
   */
  constructor(secretKeyHex, ivHex) {
    if (!secretKeyHex || !ivHex) {
      throw new Error("Secret key and IV must be provided.");
    }

    // AES encryption algorithm with 256-bit key in CBC mode
    this.algorithm = "aes-256-cbc";

    // Convert hex string inputs into buffer objects required by crypto APIs
    this.secretKey = Buffer.from(secretKeyHex, "hex");
    this.iv = Buffer.from(ivHex, "hex");
  }

  /**
   * Encrypts a plaintext string using AES-256-CBC.
   *
   * @param {string} payload - The plaintext string to encrypt.
   * @returns {string} - The encrypted string in hexadecimal format.
   */
  encryptPayload(payload) {
    try {
      // Create AES cipher instance
      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.secretKey,
        this.iv
      );

      // Perform encryption
      let encrypted = cipher.update(payload, "utf8", "hex");
      encrypted += cipher.final("hex");

      return encrypted;
    } catch (error) {
      console.log(`[❌] Error in encryptPayload: ${error.message}`);
      throw error;
    }
  }

  /**
   * Decrypts an encrypted hexadecimal string using AES-256-CBC.
   *
   * @param {string} payload - The encrypted hex string to decrypt.
   * @returns {string} - The decrypted original plaintext string.
   */
  decryptPayload(payload) {
    try {
      // Create AES decipher instance
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        this.iv
      );

      // Perform decryption
      let decrypted = decipher.update(payload, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.log(`[❌] Error in decryptPayload: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a SHA-256 hash of the provided plaintext input.
   *
   * @param {string} payload - Input string to hash.
   * @returns {string} - SHA-256 hash in hexadecimal format.
   */
  hashPayload(payload) {
    try {
      // Create SHA-256 hash instance
      const hash = crypto.createHash("sha256");

      // Feed payload into the hash
      hash.update(payload);

      return hash.digest("hex");
    } catch (error) {
      console.log(`[❌] Error in hashPayload: ${error.message}`);
      throw error;
    }
  }
}
