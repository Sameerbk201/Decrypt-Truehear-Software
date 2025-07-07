// src/core/validate.js
/**
 * Validation utilities for cryptographic parameters and inputs.
 * Provides consistent validation with clear error messages.
 */

/**
 * Validates an AES encryption key format.
 * 
 * @function validateKey
 * @param {string} input - The key to validate
 * @returns {true|string} Returns true if valid, or an error message if invalid
 * 
 * @example
 * validateKey('1234...') // "Key must be a 64-character hexadecimal string"
 * validateKey('a1b2...64chars') // true
 */
export const validateKey = (input) =>
  /^[0-9a-fA-F]{64}$/.test(input.trim()) ||
  "Key must be a 64-character hexadecimal string";
/**
 * Validates an AES initialization vector (IV) format.
 * 
 * @function validateIV
 * @param {string} input - The IV to validate
 * @returns {true|string} Returns true if valid, or an error message if invalid
 * 
 * @example
 * validateIV('abcd...') // "IV must be a 32-character hexadecimal string"
 * validateIV('1a2b...32chars') // true
 */
export const validateIV = (input) =>
  /^[0-9a-fA-F]{32}$/.test(input.trim()) ||
  "IV must be a 32-character hexadecimal string";
/**
 * Validates that an encrypted key is not empty.
 * 
 * @function validateEncryptedKey
 * @param {string} input - The encrypted key to validate
 * @returns {true|string} Returns true if valid, or an error message if invalid
 * 
 * @example
 * validateEncryptedKey('') // "Encrypted key cannot be empty"
 * validateEncryptedKey('encryptedData') // true
 */
export const validateEncryptedKey = (input) =>
  input.trim() !== "" || "Encrypted key cannot be empty";
