import CryptoJS from "crypto-js";

/**
 * EncDec – Utility class for:
 *  • AES-256-CBC encryption / decryption (PKCS#7 padding)
 *  • SHA-256 hashing
 *
 * Pure-JS implementation (crypto-js) → safe in pkg-built executables.
 */
export class EncDec {
  /**
   * @param {string} secretKeyHex 64-char hex string (32 bytes)
   * @param {string} ivHex        32-char hex string (16 bytes)
   * @throws {Error} If key/IV format invalid
   */
  constructor(secretKeyHex, ivHex) {
    try {
      if (!/^[0-9a-fA-F]{64}$/.test(secretKeyHex))
        throw new Error("Secret key must be 64-character hexadecimal");
      if (!/^[0-9a-fA-F]{32}$/.test(ivHex))
        throw new Error("IV must be 32-character hexadecimal");

      /** @private */ this.key = CryptoJS.enc.Hex.parse(secretKeyHex);
      /** @private */ this.iv = CryptoJS.enc.Hex.parse(ivHex);
    } catch (err) {
      throw new Error(`EncDec init failed: ${err.message}`);
    }
  }

  /**
   * Encrypt plaintext with AES-256-CBC.
   * @param   {string} plaintext UTF-8 string
   * @returns {string} Ciphertext (hex)
   * @throws  {Error}  If encryption fails
   */
  encryptPayload(plaintext) {
    try {
      const encrypted = CryptoJS.AES.encrypt(plaintext, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    } catch (err) {
      throw new Error(`Encryption failed: ${err.message}`);
    }
  }

  /**
   * Decrypt hex ciphertext with AES-256-CBC.
   * @param   {string} cipherHex Hex string (multiple of 32 chars)
   * @returns {string} Decrypted UTF-8 string
   * @throws  {Error}  If validation or decryption fails
   */
  decryptPayload(cipherHex) {
    // Validate hex format & block alignment (16-byte blocks → 32 hex chars)
    if (!/^[0-9a-fA-F]+$/.test(cipherHex) || cipherHex.length % 32 !== 0) {
      throw new Error(
        "Ciphertext must be hexadecimal and block-aligned (32, 64, … chars)"
      );
    }

    try {
      const cipherWords = CryptoJS.enc.Hex.parse(cipherHex);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: cipherWords },
        this.key,
        { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      return CryptoJS.enc.Utf8.stringify(decrypted);
    } catch (err) {
      throw new Error(`Decryption failed: ${err.message}`);
    }
  }

  /**
   * SHA-256 hash helper.
   * @param   {string} data Input string
   * @returns {string}  Hex-encoded SHA-256 digest
   * @throws  {Error}   If hashing fails
   */
  hashPayload(data) {
    try {
      return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    } catch (err) {
      throw new Error(`Hashing failed: ${err.message}`);
    }
  }
}
