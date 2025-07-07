// src/core/csvImport.js
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { parse } from "csv-parse/sync";
import { exportResultsToFile } from "../cli/exporter.js";
import { handleUnexpectedError } from "./error.js";
import { createSpinner } from "../utils/spinner.js";

/**
 * Handles the complete CSV import and decryption workflow including:
 * - File reading and CSV parsing
 * - Batch decryption of social security numbers
 * - Result display and optional export
 *
 * @async
 * @function handleCsvImportFlow
 * @param {Object} encdec - Initialized encryption/decryption utility instance
 * @param {string} csvPath - Path to CSV file containing encrypted data
 * @returns {Promise<void>}
 *
 * @throws {Error} If file operations fail or decryption encounters critical errors
 *
 * @example
 * const encdec = new EncDec(key, iv);
 * await handleCsvImportFlow(encdec, './data.csv');
 */
export async function handleCsvImportFlow(encdec, csvPath) {
  try {
    // Resolve absolute path and read file
    const absPath = path.resolve(csvPath);
    const content = fs.readFileSync(absPath, "utf8");
    // Parse CSV with appropriate settings
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    // Initialize decryption process with loading indicator
    const spinner = createSpinner(
      "🔍 Decrypting social security numbers..."
    ).start();
    const results = [];
    let success = 0;
    let failed = 0;
    // Process each CSV row
    for (const row of records) {
      const id = row._id || chalk.gray("N/A");
      const enc = row.socialSecurityNumber;
      let dec = chalk.red("❌ Invalid");
      // Only attempt decryption if valid encrypted data exists
      if (typeof enc === "string" && enc.length > 0) {
        try {
          dec = encdec.decryptPayload(enc);
          success++;
        } catch {
          dec = chalk.red("❌ Failed");
          failed++;
        }
      } else {
        failed++;
      }

      results.push({ _id: id, SSN: dec });
    }

    spinner.succeed("✅ Decryption complete");
    // Handle empty results case
    if (results.length === 0) {
      console.log(chalk.yellow("\n⚠️ No valid rows found.\n"));
      return;
    }
    // Display formatted results table
    console.log(chalk.cyan.bold("\n📋 Decryption Results:\n"));
    console.table(results);

    console.log(chalk.yellow("\n📊 Summary:"));
    console.log(`🧾 Total Records: ${results.length}`);
    console.log(chalk.green(`✅ Successfully Decrypted: ${success}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    // Offer results export
    await exportResultsToFile(results);
  } catch (err) {
    handleUnexpectedError(err);
  }
}
