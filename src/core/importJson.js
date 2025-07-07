// src/cli/importJson.js

import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { exportResultsToFile } from "../cli/exporter.js";
import { handleUnexpectedError } from "./error.js";

/**
 * Handles the complete JSON import and decryption workflow including:
 * - File validation and parsing
 * - Batch decryption of social security numbers
 * - Result display and export
 *
 * @async
 * @function handleJsonImportFlow
 * @param {Object} encdec - Initialized encryption/decryption utility
 * @param {string} jsonPath - Path to JSON file containing encrypted data
 * @returns {Promise<void>}
 *
 * @example
 * const encdec = new EncDec(key, iv);
 * await handleJsonImportFlow(encdec, './data.json');
 */
export async function handleJsonImportFlow(encdec, jsonPath) {
  try {
    // Resolve and validate file path
    const absPath = path.resolve(jsonPath);
    if (!fs.existsSync(absPath)) {
      console.log(chalk.red(`❌ File not found: ${absPath}`));
      return;
    }
    // Read and parse JSON file
    const raw = fs.readFileSync(absPath, "utf8");

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.log(
        chalk.red(
          "❌ Invalid JSON format. Make sure your file contains a valid JSON array."
        )
      );
      return;
    }
    // Validate JSON structure
    if (!Array.isArray(data)) {
      console.log(chalk.red("❌ JSON root must be an array of records."));
      return;
    }

    // Initialize decryption process
    const spinner = ora("🔍 Decrypting social security numbers...").start();
    const results = [];
    let success = 0;
    let failed = 0;
    // Process each record
    for (const record of data) {
      const id = formatId(record._id);
      const encSSN = record.socialSecurityNumber;
      let decrypted = chalk.red("❌ Invalid or missing");
      // Only attempt decryption if we have valid encrypted data
      if (typeof encSSN === "string" && encSSN.length > 0) {
        try {
          decrypted = encdec.decryptPayload(encSSN);
          success++;
        } catch {
          decrypted = chalk.red("❌ Decryption failed");
          failed++;
        }
      } else {
        failed++;
      }

      results.push({ _id: id, SSN: decrypted });
    }

    spinner.succeed("✅ Decryption completed");
    // Handle empty results
    if (results.length === 0) {
      console.log(chalk.yellow("\n⚠️ No records found in file.\n"));
      return;
    }

    // Show table
    console.log(chalk.cyan.bold("\n📋 Decryption Results:\n"));
    console.table(results);

    // Show stats
    console.log(chalk.yellow("\n📊 Summary:"));
    console.log(`🧾 Total Records: ${results.length}`);
    console.log(chalk.green(`✅ Successfully Decrypted: ${success}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));

    // Offer export
    await exportResultsToFile(results);
  } catch (err) {
    handleUnexpectedError(err);
  }
}
/**
 * Formats record IDs consistently for display.
 * Handles various ID formats including:
 * - Missing IDs
 * - MongoDB ObjectId format ({ $oid: '...' })
 * - Plain string IDs
 * 
 * @function formatId
 * @param {Object|string} id - The record identifier to format
 * @returns {string} Formatted ID string
 * 
 * @example
 * formatId({ $oid: '507f1f77bcf86cd799439011' }) // Returns the OID string
 * formatId('some-id') // Returns the string as-is
 */
function formatId(id) {
  if (!id) return chalk.gray("N/A");
  if (typeof id === "object" && id.$oid) return id.$oid;
  if (typeof id === "string") return id;
  return chalk.gray("Invalid _id");
}
